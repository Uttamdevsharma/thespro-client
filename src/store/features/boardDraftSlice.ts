import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BoardDraftState {
  boardNumber: string;
  defenseType: string;
  room: string;
  schedule: string;
  groups: any[];
  boardMembers: any[];
}

const initialState: BoardDraftState = {
  boardNumber: '',
  defenseType: 'Pre-Defense',
  room: '',
  schedule: '',
  groups: [],
  boardMembers: [],
};

const boardDraftSlice = createSlice({
  name: 'boardDraft',
  initialState,
  reducers: {
    setBoardDraft: (state, action: PayloadAction<Partial<BoardDraftState>>) => {
      return { ...state, ...action.payload };
    },
    clearBoardDraft: () => initialState,
  },
});

export const { setBoardDraft, clearBoardDraft } = boardDraftSlice.actions;
export default boardDraftSlice.reducer;
