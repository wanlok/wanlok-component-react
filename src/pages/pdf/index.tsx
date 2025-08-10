import { PDFViewer, Document, Page, View, Text } from "@react-pdf/renderer";
import { usePDFSnapshot } from "./usePDFSnapshot";
import { useWindowDimensions } from "../../common/useWindowDimension";

export const PDFPage = () => {
  const { snapshot } = usePDFSnapshot();
  const { height } = useWindowDimensions();
  return (
    <PDFViewer style={{ border: "none", width: "100%", height: height - 4 }}>
      <Document>
        <Page size="A4" style={{ padding: 20 }}>
          {snapshot?.rows.map((row, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>{row.value}</Text>
            </View>
          ))}
        </Page>
      </Document>
    </PDFViewer>
  );
};
