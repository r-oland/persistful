// Components==============
import Shape from 'global_components/Shape/Shape';
import React from 'react';
// =========================

export default function Pattern({
  isPenalty,
  pattern,
}: {
  isPenalty: boolean;
  pattern: PatternEntity[];
}) {
  return (
    <>
      {pattern.map((p, i) => (
        <Shape info={p} color={isPenalty ? 'red' : 'green'} key={i} />
      ))}
    </>
  );
}
