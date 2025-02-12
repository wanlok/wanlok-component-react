import dateFormat from "date-fns/format";

export default () => {
  // const date = "12 Feb 2025";
  const date = new Date("2025-07-14");
  return <div>{dateFormat(date, "d MMM yyyy")}</div>;
};
