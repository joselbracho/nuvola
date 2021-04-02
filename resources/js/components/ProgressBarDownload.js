import React from 'react';

const ProgressBarDownload = (props) => {
    var percentage = props.percentage !== null || props.percentage !== undefined ? props.percentage : 100; 
    var text = props.text !== null || props.text !== undefined ? props.text : 'Descargando, no cierre la ventana del navegador...'; 
    return (
        <React.Fragment>
            <span>{text}</span>
            <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100" style={{width: `${percentage}%`}}></div>
            </div>
        </React.Fragment>
    );
}

export default ProgressBarDownload;