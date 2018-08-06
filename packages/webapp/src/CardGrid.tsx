import * as React from "react";

import { Grid } from "@specone/core";
import styled from "react-emotion";

const Image = styled("img")`
  max-width: 300px;
`;

export default function(props: { cards: any[] }) {
  const { cards } = props;

  return (
    <Grid xs={12} container={true} spacing={16} justify="flex-start">
      {cards
        .filter(card => card.image_uris && card.image_uris.normal)
        .map((card, index) => (
          <Grid item={true} key={index}>
            <Image src={card.image_uris.normal} />
          </Grid>
        ))}
    </Grid>
  );
}
