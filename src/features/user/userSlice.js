import { createSlice } from "@reduxjs/toolkit";

function decodeData(encodedString) {
  const decodedString = new Uint8Array([...atob(encodedString)].map(char => char.charCodeAt(0)));
  return JSON.parse(new TextDecoder().decode(decodedString)); // Convert string back to JSON
}

export const userSlice = createSlice({
  name: "userId",
  initialState: {
    userData: localStorage.getItem("userInfo")
      ? decodeData(localStorage.getItem("userInfo"))
      : { error: false },
  },
  reducers: {
    updateUser: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
