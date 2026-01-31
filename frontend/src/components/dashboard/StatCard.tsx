import { CheckCheck, Eye, Files, Heart, type LucideIcon } from "lucide-react";

const StatCard = () => {
  return (
    <div className="grid grid-cols-12 gap-10 w-full">
      <Card Icon={Files} stat='Posts' statCount={124}/>
      <Card Icon={CheckCheck} stat='Published' statCount={124}/>
      <Card Icon={Eye} stat='Views' statCount={124}/>
      <Card Icon={Heart} stat='Likes' statCount={124}/>
    </div>
  )
}

export default StatCard

const Card = ({Icon, stat, statCount}: {Icon?:LucideIcon , stat: string; statCount: number}) => {
  return (
  <div className="p-6 bg-white/2 border-1 border-white/30 col-span-3 h-32 rounded-xl shadow flex flex-col gap-2">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={24} className="text-white" />}
      <h2 className="text-xl text-white">{stat}</h2>
    </div>
    <h1 className="text-3xl font-semibold text-white px-8">{statCount}</h1> 
  </div>

  )
}
