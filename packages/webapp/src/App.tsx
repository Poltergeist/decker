import * as React from "react";

import { Input } from "@specone/core";
import { css } from "emotion";

import { Observable } from "@reactivex/rxjs";

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
  result.subscribe(x => console.log(x), e => console.error(e));
};

class App extends React.Component {
  public render() {
    const className = css`
      width: 100%;
    `;
    return (
      <div className="App">
        <form onSubmit={handle}>
          <Input
            id="search"
            className={className}
            name="search"
            label="Search card"
          />
        </form>
      </div>
    );
  }
}

export default App;
