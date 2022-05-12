import './App.css';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AceEditor from 'react-ace';
import FeatherIcon from 'feather-icons-react';
import { CSVLink } from 'react-csv';

import 'ace-builds/src-min-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-sqlserver';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import getData from './mockData/getData';

const App = () => {
	const [value, setValue] = useState('select * from customers;');
    const [rows, setRows] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [query, setQuery] = useState('');
    const [defaults, setDefaults] = useState(1);
    const [csvData, setCSVData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchFlag, setSearchFlag] = useState(false);

    const runQuery = value => { // function to retieve the mock data
        toast.success("Query run");
        setSearchData([]);
        setSearchFlag(false);
        setQuery(value);
        const {headers, rows} = getData(defaults);
        setHeaders(headers);
        setRows(rows);
        const temp = []
        if(headers.length > 0 && rows.length > 0) {
            temp.push(headers);
            rows.forEach(row => {
                temp.push(row);
            });
            setCSVData(temp);
        }
    };

    const reset = () => { // function to reset the editor
        setQuery(''); 
        setValue('select * from customers;'); 
        setDefaults(1);
        setHeaders([]);
        setRows([]);
        setCSVData([]);
        setSearchData([]);
        setSearchFlag(false);
        setSearchText('');
    };


    return (
        <div className="App">

            {/* react-hot-toast for notifications*/}
            <Toaster
                position="top-center"
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: "",
                    duration: 5000,
                    style: {
                        background: "#ffffff",
                        color: "#3A4374",
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                        primary: "#809eda",
                        secondary: "#ffffff",
                        },
                    },
                    error: {
                        iconTheme: {
                        primary: "#D73737",
                        secondary: "#ffffff",
                        },
                    },
                }}
            />

            {/* body of web page */}
            <div className='main-block'>

                {/* header */}
                <div className='title-header'>
                    <h1 style={{ color:'white', fontSize: 30, fontWeight: 'bold', marginLeft: '5px', width: 'max-content', textAlign: 'center', marginRight: '1%' }}>SQL Editor</h1>
                </div>
                <h3>Queries</h3>
                {/* div containing preset query buttons */}
                <div className='preset'>
                        <button className='butt1' onClick={() => {setDefaults(1); setValue('select * from customers;')}}>
                            <p style={{ color:'#ffffff', fontSize: 14, fontWeight: 'bold', width: 'max-content' }}>customers</p>
                        </button>
                        <button className='butt1' onClick={() => {setDefaults(3); setValue('select * from products;')}}>
                            <p style={{ color:'#ffffff', fontSize: 14, fontWeight: 'bold', width: 'max-content' }}>products</p>
                        </button>
                        <button className='butt1' onClick={() => {setDefaults(2); setValue('select * from suppliers;')}}>
                            <p style={{ color:'#ffffff', fontSize: 14, fontWeight: 'bold', width: 'max-content', marginLeft:10 }}>suppliers</p>
                        </button>
                    </div>


                {/* sql editor block */}
                <div className='editor-block'>
                    <AceEditor
                        id="editor"
                        aria-label="editor"
                        mode="mysql"
                        theme="sqlserver"
                        name="editor"
                        fontSize={16}
                        minLines={15}
                        maxLines={10}
                        width="100%"
                        showPrintMargin={false}
                        showGutter
                        placeholder="Write your query here..."
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                        }}
                        value={value}
                        onChange={value => setValue(value)}
                        showLineNumbers
                    />
                </div>

                {/* div containing all buttons in one row */}
                <div className='button-block'>

                    {/* div containing run and reset buttons */}
                    <div className='editor-buttons'>
                        <button className='butt1' onClick={value => runQuery(value)}>
                            <FeatherIcon icon={'play-circle'} size={30} color={'#ffffff'}/>
                            <p style={{ color:'#ffffff', fontSize: 14, fontWeight: 'bold', marginLeft: '5px', width: 'max-content' }}>Run Query</p>
                        </button>
                        <button className='butt1' onClick={reset}>
                            <FeatherIcon icon={'refresh-cw'} size={30} color={'#ffffff'}/>
                            <p style={{ color:'#ffffff', fontSize: 14, fontWeight: 'bold', marginLeft: '5px', width: 'max-content' }}>Reset</p>
                        </button>
                    </div>

                    
                    {/* div containing export button */}
                    <div className='butt1'>
                        <CSVLink style={{ display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}} data={csvData} onClick={() => toast.success("Table exported")} filename={new Date().getTime()  }>
                            <FeatherIcon icon={'download'} size={30} color={'#ffffff'}/>
                            <p style={{ color:'#ffffff', fontSize: 14, fontWeight: 'bold', width: 'max-content' }}>Export Data</p>
                        </CSVLink>
                    </div>
                </div>

                {/* renders the table if a query was given */}
                {query ? 
                <>
                    
                    {/* div containing the table */}
                    <div className='result-block'>
                        <div className="table-div">
                            <table className="table">
                                <thead className="thead">
                                    {headers.map(header => (
                                        <th
                                            scope="col"
                                            className="table-row-head"
                                        >
                                            <span className='row-header'>
                                                {header}
                                            </span>
                                        </th>
                                    ))}
                                </thead>
                                <tbody className='tbody'>
                                    {searchFlag ? 
                                    searchData.map((row, i) => {
                                        return (
                                            <tr className='tr'>
                                            {row.map(cell => {
                                                return (
                                                    <td className="td" >
                                                        {cell}
                                                    </td>
                                                )
                                            })}
                                            </tr>
                                        )
                                    }): 
                                    rows.map((row, i) => {
                                        return (
                                            <tr className='tr'>
                                            {row.map(cell => {
                                                return (
                                                    <td className="td" >
                                                        {cell}
                                                    </td>
                                                )
                                            })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>: 
                <>
                </>}
            </div>
        </div>
    );
}

export default App;
