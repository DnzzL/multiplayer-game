/* eslint-disable-next-line */
export interface ListProps {
  items: any[];
}

export function List(props: ListProps) {
  return (
    <ul>
        {props.items.map((item, idx) =>
          <li key={idx}>{item}</li>)}
      </ul>
  );
}

export default List;
