export interface TimerState {
  whiteTime: number;
  blackTime: number;
  isRunning: boolean;
  currentTurn: 'white' | 'black';
}

/**
 * Decrement timer for current player
 */
export const decrementTimer = (
  state: TimerState,
  increment: number = 0
): TimerState => {
  if (!state.isRunning) return state;
  
  const newState = { ...state };
  
  if (state.currentTurn === 'white') {
    newState.whiteTime = Math.max(0, state.whiteTime - 1);
  } else {
    newState.blackTime = Math.max(0, state.blackTime - 1);
  }
  
  return newState;
};

/**
 * Add increment after move (Lichess style)
 */
export const addIncrement = (
  state: TimerState,
  player: 'white' | 'black',
  increment: number
): TimerState => {
  if (increment === 0) return state;
  
  const newState = { ...state };
  
  if (player === 'white') {
    newState.whiteTime += increment;
  } else {
    newState.blackTime += increment;
  }
  
  return newState;
};

/**
 * Switch turn
 */
export const switchTurn = (state: TimerState): TimerState => {
  return {
    ...state,
    currentTurn: state.currentTurn === 'white' ? 'black' : 'white'
  };
};

/**
 * Check if time has run out
 */
export const hasTimeExpired = (state: TimerState): boolean => {
  return state.whiteTime <= 0 || state.blackTime <= 0;
};
