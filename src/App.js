import ReactDOM from "react-dom/client";
import React, { lazy, Suspense } from "react";
import { combineReducers } from "redux";
import { Provider } from "react-redux";
import AppComponent from "./AppComponent";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

const sleep = (time) => new Promise((res) => setTimeout(res, time));

class App {
  plugins = {};
  reducers = {};
  routes = [];

  constructor({ plugins }) {
    this.plugins = plugins;
  }

  combineReducers(reducer) {
    const reducers = this.reducers;

    this.reducers = {
      ...reducers,
      ...reducer,
    };
  }

  addRoute(route) {
    this.routes.push(route);
  }

  async init() {
    const plugins = await Promise.all(
      Object.entries(this.plugins).map(([name, getPlugin]) => {
        return getPlugin();
      })
    );

    plugins.forEach(({ register }) => {
      register({
        addRoute: (...args) => {
          this.addRoute(...args);
        },
        combineReducers: (...args) => {
          this.combineReducers(...args);
        },
      });
    });

    return plugins;
  }

  createStore() {
    return configureStore({ reducer: combineReducers(this.reducers) });
  }

  render(element) {
    const root = ReactDOM.createRoot(element);

    const store = this.createStore();

    const elements = this.routes.map((route) => {
      return {
        ...route,
        Element: lazy(() => route.import()),
      };
    });

    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <ul>
              <li>
                <Link to={"/"}>App</Link>
              </li>
              {this.routes.map(({ path, label }) => {
                return (
                  <li key={label}>
                    <Link to={path}>{label}</Link>
                  </li>
                );
              })}
            </ul>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path={"/"} element={<AppComponent />} />
                {elements.map(({ path, Element, label }) => {
                  return (
                    <Route
                      path={path}
                      element={<Element />}
                      key={`component-${label}`}
                    />
                  );
                })}
              </Routes>
            </Suspense>
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    );
  }
}

const createApp = ({ plugins }) => new App({ plugins });

export default createApp;
