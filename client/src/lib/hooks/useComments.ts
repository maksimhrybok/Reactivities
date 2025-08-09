import { useLocalObservable } from "mobx-react-lite";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr"; // Adjust the import based on your actual signalr client library
import { useEffect, useRef } from "react";
import { runInAction } from "mobx";

export const useComments = (activityId?: string) => {
  const created = useRef(false);
  const commentStore = useLocalObservable(() => ({
    comments: [] as ChatComment[],
    hubConnection: null as HubConnection | null,

    createHubConnection(activityId: string) {
      if (!activityId) return;
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(
          `${import.meta.env.VITE_COMMENTS_URL}?activityId=${activityId}`,
          {
            withCredentials: true,
          }
        )
        .withAutomaticReconnect()
        .build();

      this.hubConnection
        .start()
        .catch((err) =>
          console.log("Error while establishing connection: ", err)
        );
      this.hubConnection.on("LoadComments", (comments) => {
        runInAction(() => {
          this.comments = comments;
        });
      });
      this.hubConnection.on("ReceiveComment", (comment) => {
        runInAction(() => {
          this.comments.unshift(comment);
        });
      });
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
    if (activityId && !created.current) {
      commentStore.createHubConnection(activityId);
      created.current = true;
    }

    return () => {
      commentStore.stopHubConnection();
      commentStore.comments = [];
    };
  }, [activityId, commentStore]);

  return { commentStore };
};
