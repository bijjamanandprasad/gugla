import React,{useEffect, useState} from 'react'

import { TextField, Typography, Button } from '@mui/material';
import {Box} from '@mui/material';

export default function KeepNoteModal({modelContent, setModelContent,state, setState, classes, setOpen}) {
console.log(modelContent)

    const [content, setContent] = useState({});
    
    const handleChangeField = (e) => { 
        e.preventDefault();
        const {name,value} = e.target;
        setContent({...content, [name]:value});
    }
    const handleEditField = () => {
        setModelContent({...modelContent, updateStatus:true});
        setContent({...content, updateStatus:true});
    }
    const handleFieldSubmit = (e) => {
        e.preventDefault();
        if(modelContent.subIndex >= 0){
            const prevState = [...state];
            prevState[modelContent.parentIndex].subList[modelContent.subIndex].description = {title:content.title, info:content.info};
            setState([...prevState]);
            console.log(state)
        }
        else if(modelContent.parentIndex!== null){
            const prevState = [...state];
            prevState[modelContent.parentIndex].description = {title:content.title, info:content.info};
            setState([...prevState]);
            console.log(state)
        }else{
            console.log('error to submit',content);

        }
        setOpen(false);

    }
    useEffect(()=>{
        setContent({
            title : modelContent.description.title || '',
            info : modelContent.description.info || '',
            updateStatus: modelContent.updateStatus || false
        })
    },[]);


  return (
   <>
        
     {content.updateStatus === false
        ?
        <>
            <Box>
            <Typography variant="button" display="block" gutterBottom>Title</Typography>
            <Typography variant="body2" display="block" gutterBottom>{content.title}</Typography>
            </Box>
            <Box>
            <Typography variant="button" display="block" gutterBottom>Information</Typography>
            <Typography variant="body2" display="block" gutterBottom>{content.info}</Typography>
            </Box>
            <Box>
                <Button variant='contained' color="warning" onClick={()=>{handleEditField()}}>
                    Edit
                </Button>  
                <Button color="error" onClick={()=>setOpen(false)}>
                    Close
                </Button>
            </Box>
        </>
        :
        <>
        <Box>
            <Typography variant="button" display="block" gutterBottom>Title</Typography>
            <TextField style={ classes.field } type='text' name='title' variant='filled' fullWidth value={content.title} onChange={(e)=>{handleChangeField(e)} } />
        </Box>
        <Box>
            <Typography variant="button" display="block" gutterBottom>Information</Typography>
            <TextField style={ classes.field } type='text' name='info' variant='filled' fullWidth value={content.info} onChange={(e)=>{handleChangeField(e)} } />
        </Box>
        <Box>
           
            <Button color="warning" variant='contained' onClick={(e)=>{handleFieldSubmit(e)}}>
                    Save
                </Button>  
            <Button color="error" onClick={()=>setOpen(false)}>
                Close
            </Button>
        </Box>
        </>
        }

   </>
  )
}

        