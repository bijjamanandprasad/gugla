import React,{useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {TextField, Typography, Button, dialogActionsClasses} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import KeepNoteModal from './KeepNoteModal';

import DialogBox from './DialogBox';

const classes = {
    container:{
        padding:"20px",
        margin:"30px auto"
    },
    title:{
        paddingBottom:'10px'
    },
    field:{
        marginBottom:'10px'
    },
    addBtn:{
        position:' absolute',
        float: 'right',
        top: '39px',
        right: '26px',
        background: '#1976d2',
        padding:' 0 10px',
        borderRadius: '25px',
        height: '36px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#333',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#fff8f2'
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#fff8f2'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


function createData(name, frequency, noOfInter, timePerInter, timeReq, timePlan, best, editStatus,subList,description) {
  return { name, frequency, noOfInter, timePerInter, timeReq, timePlan, best,editStatus, subList, description };
}
const rows = [
  createData('1 on 1s', 159, 6.0, 24, 4.0,0,'10%-12%',false,[],{title:'', info:''}),
  createData('Team meetings', 237, 9.0, 37, 4.3,0,'10%-12%',false,[],{title:'', info:''}),
  createData('Co-selling', 262, 16.0, 24, 6.0,0,'10%-12%',false,[],{title:'', info:''}),
  createData('Call review', 305, 3.7, 67, 4.3,0,'10%-12%',false,[],{title:'', info:''}),
  createData('Internal meetings', 356, 16.0, 49, 3.9,0,'10%-12%',false,[],{title:'', info:''}),
];

const SubListComponent = ({subRow, parentIndex, index, setState, state, handleKeepNoteModal}) => {
   const [obj, setObj] = useState({ 
    name: subRow.name || '', 
    frequency: subRow.frequency || '', 
    noOfInter: subRow.noOfInter || 0, 
    timePerInter: subRow.timePerInter || 0, 
    timeReq: subRow.timeReq || 0, 
    timePlan: subRow.timePlan || 0, 
    best: subRow.best || '', 
    description: subRow.description || {title:'', info:''}});

    const [editSubStatus, setEditSubStatus] = useState(false);

    const removeFromRow = () => {
        const prevState = [...state];
        prevState[parentIndex].subList.splice(index,1);
        setState([...prevState]);
        if(state[parentIndex].subList.length == 0) state[parentIndex].editStatus = false;
    }
    
    const handleSubmitSubList = (e) => {
        const prevState = [...state];

        obj.timePlan = parseInt(obj.timePerInter) + parseInt(obj.timeReq) + parseInt(obj.noOfInter);
        prevState[parentIndex].subList[index] = obj;
        
        if(prevState[parentIndex].subList.length == 1) prevState[parentIndex].timePlan = parseInt(obj.timePlan);
        else{const total = prevState[parentIndex].subList.reduce((a,b) => parseInt(a.timePlan)+parseInt(b.timePlan));
            prevState[parentIndex].timePlan = parseInt(total);}
        setState([...prevState]);
        setEditSubStatus(true);
    }

    const handleChange = (e) => {
        e.preventDefault();
        const {name,value} = e.target;
        setObj({...obj, [name]:value});
    }

    const dates = ['day','week','month'];
    useEffect(()=>{
        setObj({name: subRow.name || '', 
        frequency: subRow.frequency || '', 
        noOfInter: subRow.noOfInter || 0, 
        timePerInter: subRow.timePerInter || 0, 
        timeReq: subRow.timeReq || 0, 
        timePlan: subRow.timePlan || 0, 
        best: subRow.best || '',
        description: subRow.description || {title:'', info:''} });
    },[state]);


    return(
       <>
        { editSubStatus == false ?
            <TableRow style={{padding:20, border:'1px solid black'}}>
                <TableCell component="th" scope="row">
                    <TextField style={ classes.field }  name='name' variant='outlined' label="Name" fullWidth value={obj.name} onChange={(e)=>{handleChange(e)} } />
                </TableCell>
                <TableCell align="right">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Frequency</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={obj.frequency}
                            label="Frequency"
                            name="frequency"
                            onChange={(e)=>{handleChange(e)}}
                            >
                            {
                                dates?.map((t,i) => (
                                    <MenuItem key={"c"+i} value={t}>{t}</MenuItem>
                                    ))
                                }
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell align="right">
                    <TextField style={ classes.field }  type='number' name='noOfInter' variant='outlined' label="noOfInteractions" fullWidth value={obj.noOfInter} onChange={(e)=>{handleChange(e)} } />
                </TableCell>
                <TableCell align="right">
                    <TextField style={ classes.field } type='number' name='timePerInter' variant='outlined' label="timePerInteractions" fullWidth value={obj.timePerInter} onChange={(e)=>{handleChange(e)} } />
                </TableCell>
                <TableCell align="right">
                <TextField style={ classes.field } type='number' name='timeReq' variant='outlined' label="totoaltimeReq" fullWidth value={obj.timeReq} onChange={(e)=>{handleChange(e)} } />
                </TableCell>
                <TableCell align="right">

                </TableCell>
                <TableCell align="right">
                    
                </TableCell>
                <TableCell align="right">
                        <IconButton sx={{fontSize:14}} type='submit' color="warning" onClick={(e) => {handleSubmitSubList(e)}}>
                            save
                        </IconButton>
                        <IconButton color="error" onClick={()=>{removeFromRow()}}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={()=>{handleKeepNoteModal(parentIndex,subRow.description,true,index)}}>
                            <CalendarMonthIcon />
                        </IconButton>
                    </TableCell>    
            </TableRow> 
            :
            <TableRow style={{padding:20, border:'1px solid black'}}>
            <TableCell component="th" scope="row"><Typography sx={{textDecoration:'underline'}} onClick={()=>{handleKeepNoteModal(parentIndex,subRow.description,false,index)}}>{obj.name}</Typography></TableCell>
            <TableCell align="right">{obj.frequency}</TableCell>
            <TableCell align="right">{obj.noOfInter}</TableCell>
            <TableCell align="right">{obj.timePerInter}</TableCell>
            <TableCell align="right">{obj.timeReq}</TableCell>
            <TableCell align="right">{obj.timePlan}</TableCell>
            <TableCell align="right">{obj.best}</TableCell>
            <TableCell align="right">
                    <IconButton color="warning" onClick={()=>{setEditSubStatus(false)}}>
                        <DriveFileRenameOutlineIcon />
                    </IconButton>
                    <IconButton color="error" onClick={()=>{removeFromRow()}}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton color="primary"  onClick={()=>{handleKeepNoteModal(parentIndex,subRow.description,true,index)}}>
                        <CalendarMonthIcon />
                    </IconButton>
            </TableCell>    
        </TableRow> 

        }         
       </>
    )
}


// MAIN COMPONENT
export default function TableData() {

    const [state, setState] = useState(rows);
    const [subListState] = useState({ 
        name:'', 
        frequency:'', 
        noOfInter:0, 
        timePerInter:0, 
        timeReq:0, 
        timePlan:0, 
        best:0,
        description:{title:'',info:''},
         });


    const handleRowChange = (e,index) => {
        e.preventDefault();
        const prevState = [...state];
        const {name,value} = e.target;
        prevState[index][name] = value;
        setState([...prevState]);
    }
    const handleRowSubmit = (e,index) => {
        e.preventDefault();
        const prevState = [...state];
        if(prevState[index] != true ) prevState[index].editStatus = false;
        setState([...prevState]);
    }

    const handleEditRow = (e,index) => {
        e.preventDefault();
        const prevState = [...state];
        if(prevState[index] != true) prevState[index].editStatus = true;
        setState([...prevState]);
    }

    const addSubRow = (index) => {

        setDialog({...dialog, isLoading:true});

        const prevState = [...state];
        subListState.description.title = '';
        subListState.description.info = '';
        prevState[index].subList.push(subListState);
        if(prevState[index] != true) prevState[index].editStatus = false;
        setState(prevState);
        console.log(state)
    }

    useEffect(()=>{
        setState(state);
    },[state]);

    const [open, setOpen] = useState(false);
    const [modelContent, setModelContent] = useState({});
    const handleKeepNoteModal = (parentIndex,description,updateStatus, subIndex) => {
        if(Number(subIndex) > -1) setModelContent({parentIndex,description,updateStatus,subIndex})
        else{setModelContent({parentIndex,description,updateStatus})}
        setOpen(true);
    }

    const [dialog, setDialog] = useState({
        isLoading:false,
        text:''
    });

  return (

    <>
            <Modal className={modelContent.updateStatus ? 'modal-dialog-1' : 'modal-dialog-2'} isOpen={open} toggle={() => setOpen(!open)}>
                <ModalHeader>
                    Edit Event Name
                </ModalHeader>
                <ModalBody>
                   <KeepNoteModal 
                        modelContent={modelContent} 
                        state={state} 
                        setState={setState} 
                        classes={classes}
                        setOpen={setOpen}
                        setModelContent={setModelContent}
                        />
                </ModalBody>
            </Modal>

            {dialog.isLoading && <DialogBox dialog={dialog} setDialog={setDialog} />}
    

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Event Name</StyledTableCell>
            <StyledTableCell align="right">Frequency</StyledTableCell>
            <StyledTableCell align="right">no.of interactions</StyledTableCell>
            <StyledTableCell align="right">Time per interaction</StyledTableCell>
            <StyledTableCell align="right">Total time required</StyledTableCell>
            <StyledTableCell align="right">% of time planned</StyledTableCell>
            <StyledTableCell align="right">Best practice</StyledTableCell>
            <StyledTableCell align="right">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        
          {state?.map((row, index) => (
            <TableBody key={index}>

                {row.editStatus === true && 
                
                <StyledTableRow>
                    <StyledTableCell align="right">
                    <TextField style={ classes.field } type='text' name='name' variant='outlined' label="name" fullWidth value={row.name} onChange={(e)=>{handleRowChange(e,index)} } />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                    <TextField style={ classes.field } type='text' name='frequency' variant='outlined' label="frequency" fullWidth value={row.frequency} onChange={(e)=>{handleRowChange(e,index)} } />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                    <TextField style={ classes.field } type='text' name='noOfInter' variant='outlined' label="noOfInter" fullWidth value={row.noOfInter} onChange={(e)=>{handleRowChange(e,index)} } />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                    <TextField style={ classes.field } type='text' name='timePerInter' variant='outlined' label="timePerInter" fullWidth value={row.timePerInter} onChange={(e)=>{handleRowChange(e,index)} } />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                    <TextField style={ classes.field } type='text' name='timeReq' variant='outlined' label="timeReq" fullWidth value={row.timeReq} onChange={(e)=>{handleRowChange(e,index)} } />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                    <TextField style={ classes.field } type='text' name='timePlan' variant='outlined' label="timePlan" fullWidth value={row.timePlan} onChange={(e)=>{handleRowChange(e,index)} } />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                    <TextField style={ classes.field } type='text' name='best' variant='outlined' label="best" fullWidth value={row.best} onChange={(e)=>{handleRowChange(e,index)} } />
                    </StyledTableCell>
                        <StyledTableCell align="right">
                            <IconButton color="warning" onClick={(e)=>{handleRowSubmit(e,index)}}>
                                save
                            </IconButton> 
                            <IconButton color="error" onClick={()=>{addSubRow(index)}}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                            <IconButton color="primary" onClick={()=>{}}>
                                <CalendarMonthIcon />
                            </IconButton>
                        </StyledTableCell>
                </StyledTableRow>
                
                }
    
                {row.editStatus === false &&
                <StyledTableRow >
                    <StyledTableCell component="th" scope="row">
                    <Typography onClick={()=>{handleKeepNoteModal(index,row.description,false)}} sx={{textDecoration:'underline'}}>{row.name}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.frequency}</StyledTableCell>
                    <StyledTableCell align="right">{row.noOfInter}</StyledTableCell>
                    <StyledTableCell align="right">{row.timePerInter}</StyledTableCell>
                    <StyledTableCell align="right">{row.timeReq}</StyledTableCell>
                    <StyledTableCell align="right">{row.timePlan}</StyledTableCell>
                    <StyledTableCell align="right">{row.best}</StyledTableCell>
               
                        {
                            row.subList.length == 0 ? 
                            <StyledTableCell align="right">
                                <IconButton color="warning" onClick={(e)=> {handleEditRow(e,index)}}>
                                    <DriveFileRenameOutlineIcon />
                                </IconButton> 
                                <IconButton color="error" onClick={()=>{addSubRow(index)}}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                                <IconButton color="primary" onClick={()=>{handleKeepNoteModal(index,row.description,true)}}>
                                    <CalendarMonthIcon />
                                </IconButton>
                            </StyledTableCell>
                            :
                            <StyledTableCell align="right">
                                <IconButton disabled color="warning" onClick={()=>{}}>
                                    <DriveFileRenameOutlineIcon />
                                </IconButton> 
                                <IconButton color="error" onClick={()=>{addSubRow(index)}}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                                <IconButton color="primary" onClick={()=>{handleKeepNoteModal(index,row.description,true)}}>
                                    <CalendarMonthIcon />
                                </IconButton>
                            </StyledTableCell>
                        }
                        

                </StyledTableRow>}

                { row.subList?.length > 0 && 
                    row.subList?.map((subRow,i) => {
                        return(
                            <SubListComponent 
                            key={"b"+i+index}
                            subRow={subRow}
                            setState={setState}
                            state={state}
                            index={i} 
                            parentIndex={index} 
                            handleKeepNoteModal={handleKeepNoteModal}
                        />
                        )
                        })
                }
            </TableBody>
          ))}
        
      </Table>
    </TableContainer>

    </>
  );
}
