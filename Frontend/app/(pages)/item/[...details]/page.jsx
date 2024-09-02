import Footer1 from "@/components/footer/Footer1";
import Header1 from "@/components/headers/Header1";
import ItemDetails from "@/components/pages/item/ItemDetails";

export const metadata = {
  title: "Item Details || NFT STYLE ",
};

export default function ItemDetailsPage({ params }) {
  console.log('ItemDetailsPage-->',params)
  return (
    <>
      <Header1 />
      <main className="mt-24">
        <ItemDetails params={params} />
      </main>
      <Footer1 />
    </>
  );
}
