"use client";

import { GridSystem } from "@/lib/ui";
import { GridCell } from "./cell";

const { Row, Column } = GridSystem;

export function GridColumns() {
  return (
    <>
      <Row>
        <Column size={{ xs: 12, md: 6 }}>
          <GridCell>md 6</GridCell>
        </Column>
        <Column size={{ xs: 12, md: 6 }}>
          <GridCell>md 6</GridCell>
        </Column>
        <Column size={{ xs: 12, md: 4 }}>
          <GridCell>md 4</GridCell>
        </Column>
        <Column size={{ xs: 12, md: 4 }}>
          <GridCell>md 4</GridCell>
        </Column>
        <Column size={{ xs: 12, md: 4 }}>
          <GridCell>md 4</GridCell>
        </Column>
      </Row>
      <Row>
        <Column size={3}>
          <GridCell>3</GridCell>
        </Column>
        <Column size={3}>
          <GridCell>3</GridCell>
        </Column>
        <Column size={3}>
          <GridCell>3</GridCell>
        </Column>
        <Column size={3}>
          <GridCell>3</GridCell>
        </Column>
      </Row>
    </>
  );
}
