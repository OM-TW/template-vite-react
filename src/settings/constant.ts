import { createContext } from 'react';
import {
	Action,
	ActionType,
	LoadingProcessState,
	LoadingProcessType,
	State,
	TContext,
} from './type';
import { PAGE } from './config';

export const LOADING_PROCESS_STATE: LoadingProcessState = {
	enabled: false,
	type: LoadingProcessType.spokes,
	body: '',
};

export const initialState: State = {
	[ActionType.page]: PAGE.landing,
	[ActionType.loadingProcess]: LOADING_PROCESS_STATE,
};

export const Context = createContext<TContext>([initialState, () => {}]);
export const reducer = (state: State, action: Action): State => {
	if (action.state instanceof Object) {
		let stateStorage: { [key: string]: any } = {};
		Object.entries(action.state)
			.filter((actionState) => {
				const value = Object.values(ActionType).filter(
					(actionValue) => actionValue === actionState[0],
				);
				if (value.length > 0 || action.type) return true;
				return false;
			})
			.map((actionState) => {
				const value = Object.values(ActionType).filter(
					(actionValue) => actionValue === actionState[0],
				);
				if (value.length > 0) return actionState;
				return [action.type, Object.fromEntries([actionState])];
			})
			.forEach((actionState) => {
				if (actionState) {
					const [key, value] = actionState;
					const stringKey = String(key);
					const cloneVale = Object.fromEntries(
						Object.entries(state).filter((stateValue) => stateValue[0] === stringKey),
					);
					if (Object.prototype.hasOwnProperty.call(stateStorage, stringKey)) {
						stateStorage = {
							[stringKey]: { ...stateStorage[stringKey], ...value },
						};
					} else stateStorage = { [stringKey]: { ...cloneVale, ...value } };
				}
			});
		return { ...state, ...stateStorage };
	}
	if (action.type) return { ...state, [action.type]: action.state };
	return state;
};
