import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({children} : Readonly<{
    children: React.ReactNode;
  }>) => {

    const apiLimitCount = await getApiLimitCount()
    const isPro = await checkSubscription();


  return (
    <section className='h-full relative'>
        <aside className="hidden md:w-72 md:flex md:flex-col md:fixed md:inset-y-0  bg-[#111827] h-full ">
          <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
         </aside>
        <main className="md:pl-72" >
            <Navbar isPro={isPro}/>
            {children}
        </main>
    </section>
  )
}

export default DashboardLayout
