import useWindowDimensions from "../../common/useWindowDimensions";

export default function () {
  const { height, width } = useWindowDimensions();

  return (
    <div>
      width: {width} ~ height: {height}
    </div>
  );
}
