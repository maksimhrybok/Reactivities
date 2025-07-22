import { useLocalObservable } from "mobx-react-lite";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr"; // Adjust the import based on your actual signalr client library
import { useEffect } from "react";

export const useComments = (activityId?: string) => {
  const commentStore = useLocalObservable(() => ({
    hubConnection: null as HubConnection | null,

    createHubConnection(activityId: string) {
      if (!activityId) return;
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_COMMENT_URL}?=${activityId}`, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      this.hubConnection
        .start()
        .catch((err) =>
          console.log("Error while establishing connection: ", err)
        );
    },
    stopHubConnection() {
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        this.hubConnection
          .stop()
          .catch((err) =>
            console.log("Error while stopping connection: ", err)
          );
      }
    },
  }));

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }

    return () => {
      commentStore.stopHubConnection();
    };
  }, [activityId, commentStore]);

  return commentStore;
};
