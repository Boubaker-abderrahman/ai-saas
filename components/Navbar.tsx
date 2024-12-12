import { SignedIn, UserButton } from "@clerk/nextjs"
import MobileSideBar from "./MobileSideBar"
import { getApiLimitCount } from "@/lib/api-limit"

const Navbar = async ({isPro =false}) => {
  const apiLimitCount = await getApiLimitCount()
  return (
    <div className="flex items-center p-4">
      <MobileSideBar isPro={isPro} apiLimitCount={apiLimitCount}/>
      <div className="flex w-full justify-end">
        <SignedIn >
            <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default Navbar

