import React ,{useState,useEffect} from 'react'
import { AnimatePresence,motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from './../config/config';
import state from '../store';
import {download, logoShirt, stylishShirt} from '../assets'

import { downloadCanvasToImage,reader } from './../config/helpers';

import { EditorTabs,FilterTabs,DecalTypes } from './../config/constants';
import { fadeAnimation,slideAnimation } from '../config/motion';

import { AIPicker,ColorPicker,CustomButton,FilePicker,Tab } from '../Components';

function Customizer() {
  const snap=useSnapshot(state)


  const [file,setFile]=useState('')
  const [prompt,setPrompt]=useState('')
  const [generatingImg,setGenerateingImg]=useState(false)
   const [activeEditorTab,setActiveEditorTab]=useState("")
   const [activeFilterTab,setActiveFilterTab] =useState({logoShirt:true,stylishShirt:false})


   //show content depending on the activeTab
   const generateTableContent=()=>{
         switch(activeEditorTab){
          case "colorpicker":
             return <ColorPicker/>
          case "filepicker":
             return <FilePicker file={file} setFile={setFile} readFile={readFile}  />  
          case "aipicker" :
            return <AIPicker/>
          default:
            return null;

         }
   }
   
   const handleDecals=(type,result)=>{
    const decaltype=DecalTypes[type];
    state[decaltype.stateProperty]=result;

    if(!activeFilterTab[DecalTypes.filterTab]){
      handleActiveFilterTab(decaltype.filterTab)
    }

   }
   const handleActiveFilterTab=(tabName)=>{
       switch(tabName){
          case "logoShirt":
            state.isLogoTexture = !activeFilterTab[tabName];
             break;
          case "stylishShirt" :
            state.isFulltexture = !activeFilterTab[tabName];
          default : 
          state.isFulltexture=false;
          state.isLogoTexture=false;
       }
       setActiveFilterTab((prevState)=>{
        return{
          ...prevState,
          [tabName]: !prevState[tabName]
        }
       })
   }
  

   const readFile=(type)=>{
    reader(file).then((result)=>{
      handleDecals(type,result);
      setActiveEditorTab("");
    })
   }

  return (
    <AnimatePresence>
      {!snap.intro &&(
        <>
        <motion.div key="custom" className='absolute top-0 left-0 z-10' {...slideAnimation('left')}>
          <div className='flex items-center min-h-screen'>
           <div className='editortabs-container tabs'>
            {EditorTabs.map((tab)=>(
              <Tab 
              key={tab.name}
              tab={tab}
              handleClick={()=>setActiveEditorTab(tab.name)}
              />
            ))}
            {generateTableContent()}
           </div>
          </div>
          
        </motion.div>
        <motion.dev className="absolute z-10 top-5 right-5" {...fadeAnimation}>
          <CustomButton type='filled'
               title="Go Back"
               handleClick={()=>{state.intro=true}}
               customStyles="w-fit px-4 py-2.5 font-bold text-sm"
          />
        </motion.dev>
        <motion.div className='filtertabs-container' {...slideAnimation('up')}
           
        >
          {
            FilterTabs.map((tabs)=>(
              <Tab
              key={tabs.name}
              tab={tabs}
              isFiltertab
              isActiveTab=""
              handleClick={()=>{}}
              />
            ))
          }
          
        </motion.div>
        
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer