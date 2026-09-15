import { useEffect, useState } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "./app/hooks";

import {
  fetchDeadlines,
} from "./features/deadlines/deadlineSlice";

import DeadlineForm from "./features/deadlines/DeadlineForm";
import DeadlineList from "./features/deadlines/DeadlineList";
import DeadlineFilter from "./components/DeadlineFilter";

import type {
  DeadlineStatus,
} from "./types/deadline";

import "./App.css";

function App() {
  const dispatch = useAppDispatch();

  const deadlines = useAppSelector(
    (state) => state.deadlines.items
  );

  const loading = useAppSelector(
    (state) => state.deadlines.loading
  );

  const error = useAppSelector(
    (state) => state.deadlines.error
  );

  const [filter, setFilter] =
    useState<DeadlineStatus>("all");

  /* ================================
     LOAD DATA
  ================================= */

  useEffect(() => {
    dispatch(fetchDeadlines());
  }, [dispatch]);

  /* ================================
     STATISTICS
  ================================= */

  const total = deadlines.length;

  const completed =
    deadlines.filter(
      (item) => item.completed
    ).length;

  const pending =
    deadlines.filter(
      (item) => !item.completed
    ).length;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const overdue =
    deadlines.filter((item) => {
      const dueDate =
        new Date(item.dueDate);

      dueDate.setHours(
        0,
        0,
        0,
        0
      );

      return (
        !item.completed &&
        dueDate < today
      );
    }).length;

  /* ================================
     RECENT DEADLINES
  ================================= */

  const recentDeadlines =
    [...deadlines]
      .sort(
        (a, b) =>
          new Date(
            a.dueDate
          ).getTime() -
          new Date(
            b.dueDate
          ).getTime()
      )
      .slice(0, 3);

  return (
    <div className="app">

      {/* =================================
          SIDEBAR
      ================================= */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="brand">

          <div className="brand-icon">
            ✓
          </div>

          <div className="brand-text">

            <strong>
              StudyTask
            </strong>

            <span>
              Học tốt hơn mỗi ngày
            </span>

          </div>

        </div>


        {/* MENU */}

        <nav className="sidebar-menu">

          <div className="menu-item active">

            <span className="menu-icon">
              ⌂
            </span>

            <strong>
              Trang chủ
            </strong>

          </div>

        </nav>

      </aside>


      {/* =================================
          MAIN
      ================================= */}

      <main className="main">

        {/* =================================
            TOP BAR
        ================================= */}

        <header className="topbar">

          <div className="page-title">
            Student Deadline Tracker
          </div>

          <div className="profile">

            <div className="notification">

              ♧

              {overdue > 0 && (
                <b>
                  {overdue}
                </b>
              )}

            </div>

            <div className="avatar">
              T
            </div>

            <span>
              Hoài
            </span>

            <small>
              ⌄
            </small>

          </div>

        </header>


        {/* =================================
            DASHBOARD
        ================================= */}

        <div className="dashboard">

          {/* =================================
              CENTER CONTENT
          ================================= */}

          <section className="center-content">

            {/* WELCOME */}

            <div className="welcome">

              <div className="welcome-content">

                <div className="welcome-label">
                  STUDENT PRODUCTIVITY
                </div>

                <h1>
                  Xin chào, Hoài! 
                </h1>

                <p>
                  Cố lên! Mỗi bài tập hoàn thành
                  là một bước tiến gần hơn đến mục tiêu của bạn.
                </p>

              </div>

              <div className="welcome-decoration">
                📚
              </div>

            </div>


            {/* =================================
                FILTER
            ================================= */}

            <DeadlineFilter>

              <DeadlineFilter.Item
                value="all"
                current={filter}
                onClick={setFilter}
              >
                Tất cả

                <b>
                  {total}
                </b>

              </DeadlineFilter.Item>


              <DeadlineFilter.Item
                value="pending"
                current={filter}
                onClick={setFilter}
              >
                Chưa hoàn thành

                <b>
                  {pending}
                </b>

              </DeadlineFilter.Item>


              <DeadlineFilter.Item
                value="overdue"
                current={filter}
                onClick={setFilter}
              >
                Quá hạn

                <b>
                  {overdue}
                </b>

              </DeadlineFilter.Item>


              <DeadlineFilter.Item
                value="completed"
                current={filter}
                onClick={setFilter}
              >
                Đã hoàn thành

                <b>
                  {completed}
                </b>

              </DeadlineFilter.Item>

            </DeadlineFilter>


            {/* =================================
                DEADLINE SECTION
            ================================= */}

            <section className="task-section">

              <div className="task-header">

                <div>

                  <h2>
                    Danh sách bài tập
                  </h2>

                  <p>
                    Theo dõi các deadline
                    và tiến độ học tập
                  </p>

                </div>

                <span className="task-count">
                  {total} bài tập
                </span>

              </div>


              {/* LOADING */}

              {loading && (
                <div className="loading-box">

                  <div className="spinner">
                  </div>

                  <p>
                    Đang tải dữ liệu...
                  </p>

                </div>
              )}


              {/* ERROR */}

              {error && (
                <div className="error-box">
                  ⚠️ {error}
                </div>
              )}


              {/* DEADLINE LIST */}

              {!loading && (
                <DeadlineList
                  filter={filter}
                />
              )}

            </section>

          </section>


          {/* =================================
              RIGHT SIDEBAR
          ================================= */}

          <aside className="right-sidebar">

            {/* QUICK STATISTICS */}

            <section className="side-card">

              <div className="side-title">

                <h3>
                  ▥ Thống kê nhanh
                </h3>

              </div>


              <div className="quick-stats">

                <div className="quick-stat red">

                  <span>
                    ▣
                  </span>

                  <div>

                    <strong>
                      {total}
                    </strong>

                    <small>
                      Tổng bài tập
                    </small>

                  </div>

                </div>


                <div className="quick-stat green">

                  <span>
                    ✓
                  </span>

                  <div>

                    <strong>
                      {completed}
                    </strong>

                    <small>
                      Đã hoàn thành
                    </small>

                  </div>

                </div>


                <div className="quick-stat pink">

                  <span>
                    ◷
                  </span>

                  <div>

                    <strong>
                      {pending}
                    </strong>

                    <small>
                      Chưa hoàn thành
                    </small>

                  </div>

                </div>


                <div className="quick-stat orange">

                  <span>
                    ⚠
                  </span>

                  <div>

                    <strong>
                      {overdue}
                    </strong>

                    <small>
                      Quá hạn
                    </small>

                  </div>

                </div>

              </div>

            </section>


            {/* UPCOMING DEADLINES */}

            <section className="side-card">

              <div className="side-title">

                <h3>
                  ▣ Hạn nộp gần đây
                </h3>

                <span>
                  {total} bài
                </span>

              </div>


              <div className="upcoming-list">

                {recentDeadlines.length === 0 && (
                  <div className="no-upcoming">
                    Chưa có deadline
                  </div>
                )}

                {recentDeadlines.map(
                  (deadline) => {

                    const dueDate =
                      new Date(
                        deadline.dueDate
                      );

                    const currentDate =
                      new Date();

                    currentDate.setHours(
                      0,
                      0,
                      0,
                      0
                    );

                    dueDate.setHours(
                      0,
                      0,
                      0,
                      0
                    );

                    const days =
                      Math.ceil(
                        (
                          dueDate.getTime() -
                          currentDate.getTime()
                        ) /
                        (
                          1000 *
                          60 *
                          60 *
                          24
                        )
                      );

                    return (
                      <div
                        className="upcoming-item"
                        key={deadline.id}
                      >

                        <div className="timeline-dot">
                        </div>

                        <div className="upcoming-info">

                          <strong>
                            {deadline.title}
                          </strong>

                          <small>
                            {deadline.subject}
                          </small>

                          <small>
                            Hạn:{" "}
                            {deadline.dueDate}
                          </small>

                        </div>

                        <span
                          className={
                            days < 0
                              ? "late"
                              : "soon"
                          }
                        >
                          {days < 0
                            ? `Quá hạn ${Math.abs(days)} ngày`
                            : `Còn ${days} ngày`}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </section>


            {/* ADD DEADLINE */}

            <section className="side-card add-card">

              <div className="side-title">

                <h3>
                  ＋ Thêm bài tập mới
                </h3>

              </div>

              <p>
                Tạo deadline mới để quản lý
                công việc học tập.
              </p>

              <DeadlineForm />

            </section>

          </aside>

        </div>


        {/* =================================
            FOOTER
        ================================= */}

        <footer>
          StudyTask · Student Deadline Tracker
        </footer>

      </main>

    </div>
  );
}

export default App;