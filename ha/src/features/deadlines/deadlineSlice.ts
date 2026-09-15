import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  Deadline,
  ApiResponse,
} from "../../types/deadline";

import {
  isDeadline,
} from "../../types/deadline";

/* =========================================
   LOCAL STORAGE KEY
========================================= */

const STORAGE_KEY =
  "student-deadline-tracker";

/* =========================================
   STATE
========================================= */

interface DeadlineState {
  items: Deadline[];
  loading: boolean;
  error: string | null;
}

const initialState: DeadlineState = {
  items: [],
  loading: false,
  error: null,
};

/* =========================================
   MOCK API
========================================= */

const fakeApi =
  (): Promise<ApiResponse<Deadline[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          "✅ Mock API được gọi"
        );

        const data: unknown[] = [
          {
            id: 1,
            subject: "Lập trình Web",
            title: "Bài tập React",
            dueDate: "2026-09-18",
            priority: "High",
            completed: false,
          },

          {
            id: 2,
            subject: "Cơ sở dữ liệu",
            title: "Thiết kế Database",
            dueDate: "2026-09-20",
            priority: "Medium",
            completed: false,
          },

          {
            id: 3,
            subject: "Phân tích nghiệp vụ",
            title: "Vẽ Use Case",
            dueDate: "2026-09-12",
            priority: "High",
            completed: false,
          },

          {
            id: 4,
            subject: "Kiểm thử phần mềm",
            title: "Viết Test Case",
            dueDate: "2026-09-25",
            priority: "Low",
            completed: true,
          },
        ];

        /* Type Guard */
        const validData =
          data.filter(isDeadline);

        console.log(
          "📦 Dữ liệu Mock API:",
          validData
        );

        resolve({
          message:
            "Lấy dữ liệu thành công",

          data: validData,
        });
      }, 1000);
    });
  };

/* =========================================
   LOAD DATA
========================================= */

export const fetchDeadlines =
  createAsyncThunk(
    "deadlines/fetchDeadlines",

    async () => {
      /*
       Kiểm tra LocalStorage trước
      */

      const savedData =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (savedData) {
        try {
          const parsedData =
            JSON.parse(savedData);

          /*
           Kiểm tra dữ liệu bằng Type Guard
          */

          if (
            Array.isArray(parsedData)
          ) {
            const validData =
              parsedData.filter(
                isDeadline
              );

            if (
              validData.length > 0
            ) {
              console.log(
                "💾 Lấy dữ liệu từ LocalStorage"
              );

              return validData;
            }
          }
        } catch (error) {
          console.error(
            "LocalStorage không hợp lệ:",
            error
          );
        }
      }

      /*
       Nếu chưa có LocalStorage
       → gọi Mock API
      */

      console.log(
        "🌐 Chưa có dữ liệu → gọi Mock API"
      );

      const response =
        await fakeApi();

      /*
       Lưu dữ liệu API vào LocalStorage
      */

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          response.data
        )
      );

      return response.data;
    }
  );

/* =========================================
   SLICE
========================================= */

const deadlineSlice = createSlice({
  name: "deadlines",

  initialState,

  reducers: {
    /* =====================================
       ADD
    ===================================== */

    addDeadline: (
      state,
      action: PayloadAction<Deadline>
    ) => {
      state.items.push(
        action.payload
      );

      /*
       Lưu lại LocalStorage
      */

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          state.items
        )
      );
    },

    /* =====================================
       TOGGLE
    ===================================== */

    toggleDeadline: (
      state,
      action: PayloadAction<number>
    ) => {
      const deadline =
        state.items.find(
          (item) =>
            item.id ===
            action.payload
        );

      if (deadline) {
        deadline.completed =
          !deadline.completed;

        /*
         Lưu lại LocalStorage
        */

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            state.items
          )
        );
      }
    },

    /* =====================================
       DELETE
    ===================================== */

    deleteDeadline: (
      state,
      action: PayloadAction<number>
    ) => {
      state.items =
        state.items.filter(
          (item) =>
            item.id !==
            action.payload
        );

      /*
       Lưu lại LocalStorage
      */

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          state.items
        )
      );
    },
  },

  /* =====================================
     ASYNC STATES
  ===================================== */

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchDeadlines.pending,
        (state) => {
          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        fetchDeadlines.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.items =
            action.payload;
        }
      )

      .addCase(
        fetchDeadlines.rejected,
        (state) => {
          state.loading = false;

          state.error =
            "Không thể lấy dữ liệu";
        }
      );
  },
});

/* =========================================
   EXPORT ACTIONS
========================================= */

export const {
  addDeadline,
  toggleDeadline,
  deleteDeadline,
} = deadlineSlice.actions;

/* =========================================
   EXPORT REDUCER
========================================= */

export default deadlineSlice.reducer;