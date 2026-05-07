/**
 * useProject.js
 *
 * Custom hook that:
 *  1. Fetches a project from the API on mount.
 *  2. Subscribes to real-time socket events and merges updates into local state.
 *  3. Exposes action helpers (submit, requestRevision, approve, updateProgress)
 *     that call the API and optimistically update local state.
 *
 * Usage:
 *   const { project, loading, error, actions } = useProject(projectId);
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import * as projectService from '../services/projectService';

const PROJECT_EVENTS = [
  'project_update',
  'project_progress',
  'project_submitted',
  'revision_requested',
  'project_approved',
  'project_cancelled',
  'deliverable_submitted',
  'payment_released',
];

export default function useProject(projectId) {
  const socket = useSocket();
  const [project, setProject]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const [actionError, setActionError]     = useState(null);
  // Prevent stale closures in socket handlers
  const projectRef = useRef(project);
  useEffect(() => { projectRef.current = project; }, [project]);

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getProject(projectId);
      setProject(res.data.project);
    } catch (err) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  // ── Socket subscriptions ───────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !projectId) return;

    const handleUpdate = (updatedProject) => {
      // Only apply if this event is for our project
      if (updatedProject?.id !== projectId && updatedProject?.project?.id !== projectId) return;
      const proj = updatedProject?.project ?? updatedProject;
      setProject((prev) => prev ? { ...prev, ...proj } : proj);
    };

    const handleDeliverableSubmitted = ({ project: proj, deliverable }) => {
      if (proj?.id !== projectId) return;
      setProject((prev) => prev ? {
        ...prev,
        ...proj,
        latest_deliverable: deliverable,
        all_deliverables: [deliverable, ...(prev.all_deliverables ?? [])],
      } : proj);
    };

    const handleRevisionRequested = ({ project: proj, revision }) => {
      if (proj?.id !== projectId) return;
      setProject((prev) => prev ? {
        ...prev,
        ...proj,
        open_revisions: [revision, ...(prev.open_revisions ?? [])],
      } : proj);
    };

    PROJECT_EVENTS.forEach((ev) => {
      if (ev === 'deliverable_submitted') {
        socket.on(ev, handleDeliverableSubmitted);
      } else if (ev === 'revision_requested') {
        socket.on(ev, handleRevisionRequested);
      } else {
        socket.on(ev, handleUpdate);
      }
    });

    return () => {
      PROJECT_EVENTS.forEach((ev) => {
        socket.off(ev, handleUpdate);
        socket.off(ev, handleDeliverableSubmitted);
        socket.off(ev, handleRevisionRequested);
      });
    };
  }, [socket, projectId]);

  // ── Action helpers ─────────────────────────────────────────────────────
  const runAction = useCallback(async (fn) => {
    try {
      setActionPending(true);
      setActionError(null);
      const result = await fn();
      // Merge returned data into local state immediately
      const proj = result?.data?.project ?? result?.data?.result?.project ?? null;
      if (proj) {
        setProject((prev) => prev ? {
          ...prev,
          ...proj,
          // Preserve enriched sub-arrays if not returned by the action
          latest_deliverable: result?.data?.deliverable ?? prev.latest_deliverable,
          all_deliverables: result?.data?.deliverable
            ? [result.data.deliverable, ...(prev.all_deliverables ?? [])]
            : prev.all_deliverables,
          open_revisions: result?.data?.revision
            ? [result.data.revision, ...(prev.open_revisions ?? [])]
            : proj.status !== 'revision_requested'
              ? (prev.open_revisions ?? [])
              : prev.open_revisions,
        } : proj);
      }
      return result;
    } catch (err) {
      setActionError(err.message || 'Action failed');
      throw err;
    } finally {
      setActionPending(false);
    }
  }, []);

  const actions = {
    updateProgress: (progress) =>
      runAction(() => projectService.updateProgress(projectId, progress)),

    submitDeliverable: (payload) =>
      runAction(() => projectService.submitDeliverable(projectId, payload)),

    requestRevision: (payload) =>
      runAction(() => projectService.requestRevision(projectId, payload)),

    approve: () =>
      runAction(() => projectService.approveProject(projectId)),

    cancel: (reason) =>
      runAction(() => projectService.cancelProject(projectId, reason)),

    refresh: fetchProject,
  };

  return { project, loading, error, actionPending, actionError, actions };
}
