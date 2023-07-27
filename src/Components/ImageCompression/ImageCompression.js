import React from 'react'
import "./ImageCompression.css"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../Common/Button/Button';
import { useState, useRef } from 'react';
import imageCompression from "browser-image-compression";
import ProgressBar from '../ProgressBar/ProgressBar';


export default function ImageCompression() {

    const fileInputRef = useRef();


    const [compressedImagesLoading, setCompressedImagesLoading] = useState(false)
    const [compressedImagesArray, setCompressedImagesArray] = useState([])


    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };



    const handleFileSelected = (event) => {
        const selectedFiles = event.target.files;
        const filesArray = Object.values(selectedFiles);
        compressImagesAlgorithm(filesArray)
    };

    const downloadCompressedImage = (downloadLink, fileName) => {
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = fileName; // Set the file name for download
        link.click();
    };



    const compressImagesAlgorithm = (selectedFiles) => {



        const compressionPromises = selectedFiles.map(async (uncompressedImage, unCompressedImageIndex) => {

            const originalFileName = uncompressedImage.name

            const originalImageSizeInBytes = uncompressedImage.size;
            const originalImageSizeInMB = originalImageSizeInBytes / (1024 * 1024);

            // alert(originalImageSizeInMB)

            const options = {
                maxSizeMB: originalImageSizeInMB,
                quality: 0.8,
                useWebWorker: true,
                onProgress: (progress) => {
                    console.log(`Compression Progress: ${progress}%`, originalFileName);
                    setCompressedImagesLoading(progress);

                },
            };

            return imageCompression(uncompressedImage, options)
                .then((output) => {
                    const originalImageSize = uncompressedImage.size;
                    const compressedImageSize = output.size;
                    const compressionRatio = ((compressedImageSize - originalImageSize) / originalImageSize) * 100;
                    const roundedCompressionRatio = compressionRatio.toFixed(2);

                    const downloadLink = URL.createObjectURL(output);

                    return {
                        fileName: `${output.name}`,
                        compressionRatio: roundedCompressionRatio,
                        downloadLink: downloadLink,
                    };
                });
        });

        console.log("compression promises", compressionPromises)


        compressionPromises.forEach((compressedImagePromise, index) => {

            compressedImagePromise.then((compressedImages) => {
                console.log("compressedImages", compressedImages);
                setCompressedImagesArray((prevArray) => { return [...prevArray, compressedImages] });
                setCompressedImagesLoading(false)

            })
                .catch((error) => {
                    console.error("Error compressing images:", error);
                    setCompressedImagesLoading(false)

                });
        })


    };


    const clearSelectedImages = () => {
        setCompressedImagesArray([])
    }



    const deleteSpecificImage = (currentIndex) => {
        const modifiedArray = [...compressedImagesArray];
        modifiedArray.splice(currentIndex, 1);
        setCompressedImagesArray(modifiedArray);

    }

    return (


        <div className="row" style={{ marginTop: "70px" }}>

            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2"></div>


            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8">

                <div className='outer-div'>

                    <div className='upload-clear-queue-buttons'>

                        <div className='upload-image-buttons-section'>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                multiple
                                accept="image/*"
                                onChange={handleFileSelected}
                            />
                            <Button
                                onClick={handleFileInputClick}
                                buttonText={'UPLOAD IMAGES'}
                                buttonIcon={faImage}
                                disabled={false}
                                style={{
                                    backgroundColor: '#2a73d9',
                                    color: 'white'

                                }}
                            />


                        </div>

                        <Button
                            onClick={clearSelectedImages}
                            buttonText={'CLEAR QUEUE'}
                            buttonIcon={faTimes}
                            disabled={compressedImagesArray.length < 1}
                            style={{
                                backgroundColor: '#D44D3B',
                                color: 'white',
                                opacity: compressedImagesArray.length > 0 ? "1" : "0.5"
                            }}
                        />

                    </div>

                    <div className='compressed-images-div'>
                        {
                            compressedImagesArray.length > 0 ?

                                compressedImagesArray.map((compressedItem, currentIndex) => {
                                    return <div className='selected-compressed-images' key={compressedItem.fileName}>
                                        <div className='compressed-image'>
                                            <div className='cross-icon-compressed'>
                                                <FontAwesomeIcon icon={faTimes} onClick={() => deleteSpecificImage(currentIndex)} />
                                            </div>

                                            <p className='reduction-percentage'>{compressedItem.compressionRatio + "%"}</p>

                                            <div className='overlay'></div>
                                            <img src={compressedItem.downloadLink} alt='image.png' />

                                            <div className='download-button-container'>
                                                <button className='download-button' onClick={() => downloadCompressedImage(compressedItem.downloadLink, compressedItem.fileName)}>
                                                    Download Image
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                })
                                :
                                <div className="no-images-selected-overlay">
                                    {compressedImagesLoading ?
                                        <p className='text-no-image-selected'>Compressing... {compressedImagesLoading}%</p> :
                                        <p className='text-no-image-selected'>No Images Selected</p>
                                    }
                                </div>
                        }
                    </div>



                    {/* <div className='download-all-link-button'>


                        <Button
                            onClick={() => { }}
                            buttonText={'DOWNLOAD ALL'}
                            buttonIcon={faArrowDown}
                            disabled={compressedImagesArray.length > 0}
                            style={{ backgroundColor: '#38404B', color: 'white', opacity: compressedImagesArray.length > 0 ? "1" : "0.5" }}
                        />

                    </div> */}

                </div>
            </div>

            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2"></div>
        </div>
    )
}
