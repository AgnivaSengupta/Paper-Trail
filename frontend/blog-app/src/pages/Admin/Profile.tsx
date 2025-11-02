import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Pencil } from 'lucide-react'
import { useState } from 'react'
import Test from './Test'

type editType = {
  name: boolean;
  email: boolean;
  bio: boolean;
}

const Profile = () => {

  const [nameEdit, setNameEdit] = useState(false);
  const [name, setName] = useState('');

  const [editField, setEditField] = useState<editType>({
    name: false,
    email: false,
    bio: false
  });

  const handleSave = (field:string, value:string) => {
    setEditField({...editField, [field]: value});
  }

  return (
    <Test>
        <div className='p-5 flex flex-col gap-5 px-10 w-[60%] font-munoch'>
            <div>
                <h1 className='text-3xl font-semibold'>My Profile</h1>
                <p className='text-base text-muted-foreground'>Manage the profile settings</p>
            </div>

            <div className='relative'>
              <div className='flex items-center border-none h-36 rounded-lg bg-stone-800'>
                <img src='../../public/hot-air-balloon-9070079_1920.jpg' className='w-full h-full object-cover rounded-lg'/>
              </div>
              <div className='absolute bottom-[-45px] left-10 border-1 p-[2px] rounded-full bg-stone-100 flex justify-center items-center'>
                <img
                          src="https://api.dicebear.com/9.x/notionists/svg?seed=Kingston"
                          alt="avatar"
                          className="size-25 border-black border-2 bg-amber-100 rounded-full shrink-0"
                />
              </div>
            </div>

            <div className='flex flex-col gap-3 mt-10 text-base px-5'>
              <div id='NameField' className='flex items-center gap-10'>
                {editField.name ? 
                  <div className='flex flex-col gap-2 w-full'>
                    <Label htmlFor='Name' className='text-xl'>Name</Label>
                    <div className='flex gap-8 items-center'>
                      <Input id='Name'
                       className='bg-white/5 border-border w-full'
                       value='e.target.value'
                       />
                      <Check className='size-6 cursor-pointer text-foreground' onClick={() => setEditField({...editField, name: false})}/>
                    </div>
                  </div> 
                  :

                  <div className='flex gap-10'>
                    <h1 className='text-2xl'>Agniva Sengupta</h1>
                    <Pencil className='size-5 text-foreground cursor-pointer' onClick={() => setEditField({...editField, name: true})}/>
                  </div>
                }
                {/* <div className='flex gap-10'>
                  <h1 className='text-lg'>Agniva Sengupta</h1>
                  <Pencil className='size-5 text-gray-400 cursor-pointer hover:text-white' onClick={() => setNameEdit(true)}/>
                </div> */}
              </div>

              <div id='EmailField' className='mt-2'>
                {editField.email ? 
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='Email' className='text-xl'>Email</Label>
                    <div className='flex gap-8 items-center'>
                      <Input id='Name'
                       className='bg-white/5 border-border w-full'
                       value='e.target.value'
                       />
                      <Check className='size-6 cursor-pointer text-foreground' onClick={() => setEditField({...editField, email: false})}/>
                    </div>
                  </div>
                  :
                  <div className='flex gap-10'>
                    <h1 className='text-lg font-extralight'>agnivasengupta11@gmail.com</h1>
                    <Pencil className='size-5 text-foreground cursor-pointer' onClick={() => setEditField({...editField, email: true})}/>
                  </div>  
                }
              </div>

              <div id='BioField' className='mt-5'>
                {editField.bio ? 
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='Bio' className='text-xl'>Bio</Label>
                    <div className='flex gap-8 items-center'>
                      <textarea id='Bio'
                       className='bg-white/5 border-border w-full rounded-lg py-2 px-3 text-sm'
                       value='e.target.value'
                       />
                      <Check className='size-6 text-foreground cursor-pointer' onClick={() => setEditField({...editField, bio: false})}/>
                    </div>
                  </div>
                  :
                  <div className='flex gap-10'>
                    <p className='text-base font-extralight w-[60%]'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam doloribus aliquam esse, cum autem reiciendis exercitationem molestiae labore ipsum quibusdam dolores, quis illum maiores ut alias nostrum iste eveniet in!</p>
                    <Pencil className='size-5 text-foreground cursor-pointer' onClick={() => setEditField({...editField, bio: true})}/>
                  </div>  
                }
              </div>
            </div>
        </div>
    </Test>
  )
}

export default Profile