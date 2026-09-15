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

  useEffect(() => {
    dispatch(fetchDeadlines());
  }, [dispatch]);

  const total = deadlines.length;

  const completed = deadlines.filter(
    (item) => item.completed
  ).length;

  const pending = deadlines.filter(
    (item) => !item.completed
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = deadlines.filter((item) => {
    const dueDate = new Date(item.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return (
      !item.completed &&
      dueDate < today
    );
  }).length;

  return (
    <div className="app">
      <header className="hero">
        <div>
          <div className="badge">
            STUDENT PRODUCTIVITY
          </div>

          <h1>
            Student Deadline Tracker
          </h1>

          <p>
            Quản lý bài tập và deadline của bạn
            một cách đơn giản và hiệu quả.
          </p>
        </div>

        <div className="hero-icon">
          📚
        </div>
      </header>

      <main className="content">

        {/* Statistics */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon blue">
              📋
            </div>

            <div>
              <span>Tổng bài tập</span>
              <strong>{total}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              ⏳
            </div>

            <div>
              <span>Chưa hoàn thành</span>
              <strong>{pending}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              ⚠️
            </div>

            <div>
              <span>Quá hạn</span>
              <strong>{overdue}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <span>Đã hoàn thành</span>
              <strong>{completed}</strong>
            </div>
          </div>

        </section>

        {/* Add deadline */}
        <DeadlineForm />

        {/* Deadline list */}
        <section className="deadline-section">

          <div className="section-header">
            <div>
              <h2>Danh sách bài tập</h2>
              <p>
                Theo dõi các deadline sắp tới của bạn
              </p>
            </div>

            <div className="total-badge">
              {total} bài tập
            </div>
          </div>

          <DeadlineFilter>
            <DeadlineFilter.Item
              value="all"
              current={filter}
              onClick={setFilter}
            >
              Tất cả
            </DeadlineFilter.Item>

            <DeadlineFilter.Item
              value="pending"
              current={filter}
              onClick={setFilter}
            >
              Chưa hoàn thành
            </DeadlineFilter.Item>

            <DeadlineFilter.Item
              value="overdue"
              current={filter}
              onClick={setFilter}
            >
              Quá hạn
            </DeadlineFilter.Item>

            <DeadlineFilter.Item
              value="completed"
              current={filter}
              onClick={setFilter}
            >
              Đã hoàn thành
            </DeadlineFilter.Item>
          </DeadlineFilter>

          {loading && (
            <div className="loading-box">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          )}

          {error && (
            <div className="error-box">
              ⚠️ {error}
            </div>
          )}

          {!loading && (
            <DeadlineList
              filter={filter}
            />
          )}

        </section>
      </main>

      <footer>
        Student Deadline Tracker • React + TypeScript + Redux Toolkit
      </footer>
    </div>
  );
}

export default App;