import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAccount();
  const location = useLocation();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },
    enabled: !id && location.pathname === "/activities" && !!currentUser,
    select: (data) => {
      return data.map((activity) => {
        return {
          ...activity,
          isHost: currentUser?.id === activity.hostId,
          isGoing: activity.attendees.some((x) => x.id === currentUser?.id),
        };
      });
    },
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    enabled: !!id && !!currentUser,
    select: (data) => {
      return {
        ...data,
        isHost: currentUser?.id === data.hostId,
        isGoing: data.attendees.some((x) => x.id === currentUser?.id),
      };
    },
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.put(`/activities/`, activity);
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const responce = await agent.post("/activities", activity);
      return responce.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const updateAttendance = useMutation({
    mutationFn: async (id: string) => {
      console.log("mutation id: " + id);
      await agent.post(`/activities/${id}/attend`);
    },
    onSuccess: async () => {
      console.log("query id: " + id);
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["activities", id] });
    },
  });

  return {
    activities,
    isLoading,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity,
    updateAttendance,
  };
};
