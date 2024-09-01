import { CompletedConnection } from "../types";

export const ADD_COMPLETED_CONNECTION = 'ADD_COMPLETED_CONNECTION';

export interface AddCompletedConnectionAction {
  type: typeof ADD_COMPLETED_CONNECTION;
  payload: CompletedConnection;
}

export type CompletedConnectionsActionTypes = AddCompletedConnectionAction;

// export const addCompletedConnection = (connection: CompletedConnection): CompletedConnectionsActionTypes => ({
//   type: ADD_COMPLETED_CONNECTION,
//   payload: connection,
// });
