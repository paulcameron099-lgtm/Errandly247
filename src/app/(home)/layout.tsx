import Header from "@/layout/HeaderLayout";
import Footer from "@/layout/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="bg-white text-gray-900 dark:bg-white dark:text-gray-900">
        {children}
      </div>
      <Footer />
    </>
  );
}