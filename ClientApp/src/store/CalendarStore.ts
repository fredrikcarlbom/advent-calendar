import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CalendarState {
    isLoading: boolean;
    startDateIndex?: number;
    days: Day[];
}

export interface Day {
    Enabled: boolean;
    DayNumber: number;
    Content: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestCalendarAction {
    type: 'REQUEST_CALENDAR';
    startDateIndex: number;
}

interface ReceiveCalendarAction {
    type: 'RECEIVE_CALENDAR';
    startDateIndex: number;
    calendar: Day[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestCalendarAction | ReceiveCalendarAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestWeatherForecasts: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.calendar && startDateIndex !== appState.calendar.startDateIndex) {
            fetch(`weatherforecast`)
                .then(response => response.json() as Promise<Day[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_CALENDAR', startDateIndex: startDateIndex, calendar: data });
                });

            dispatch({ type: 'REQUEST_CALENDAR', startDateIndex: startDateIndex });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CalendarState = { days: [], isLoading: false };

export const reducer: Reducer<CalendarState> = (state: CalendarState | undefined, incomingAction: Action): CalendarState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CALENDAR':
            return {
                startDateIndex: action.startDateIndex,
                days: state.days,
                isLoading: true
            };
        case 'RECEIVE_CALENDAR':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    days: action.calendar,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
