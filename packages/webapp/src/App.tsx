import * as React from "react";

import { Input } from "@specone/core";
import { css } from "emotion";

import { BehaviorSubject, Observable } from "@reactivex/rxjs";

import { componentFromStream } from "recompose";

import CardGrid from "./CardGrid";
const cards$ = new BehaviorSubject([]);

const handle: React.FormEventHandler<HTMLFormElement> = event => {
  event.preventDefault();
  const result = Observable.fromPromise(
    fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        event.currentTarget.search.value
      )}`
    )
  ).flatMap(response => {
    return response.json();
  });
  result.subscribe(x => cards$.next(x.data), e => console.error(e));
};

const Component = componentFromStream(props$ => {
  return Observable.combineLatest([cards$]).map(([cards = []], index) => {
    return <CardGrid key={index} cards={cards} />;
  });
});

class App extends React.Component {
  public render() {
    const className = css`
      width: 100%;
    `;
    return (
      <div className="App">
        <div>
          <form onSubmit={handle}>
            <Input
              id="search"
              className={className}
              name="search"
              label="Search card"
            />
          </form>
        </div>
        <Component />
      </div>
    );
  }
}

export default App;
