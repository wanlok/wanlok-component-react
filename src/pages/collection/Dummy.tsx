import { WText } from "../../components/WText";

export const Dummy = () => {
  return (
    <>
      <WText
        text="Attributes"
        editable={false}
        rightButtons={[
          {
            label: "Add",
            onClick: () => {
              console.log("Hello World");
            }
          }
        ]}
      />
    </>
  );
};
