import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import mushroomImage from './assets/logo.jpg'; // Add your mushroom image path here
import axios from 'axios'; // Import axios for making HTTP requests
import Swal from 'sweetalert2'; // Import SweetAlert2

const Prediction = () => {
    const [inputs, setInputs] = useState({
        'cap-diameter': '',
        'cap-shape': '',
        'cap-surface': '',
        'cap-color': '',
        'does-bruise-or-bleed': '',
        'gill-attachment': '',
        'gill-spacing': '',
        'gill-color': '',
        'stem-height': '',
        'stem-width': '',
        'stem-root': '',
        'stem-surface': '',
        'stem-color': '',
        'veil-type': '',
        'veil-color': '',
        'has-ring': '',
        'ring-type': '',
        'spore-print-color': '',
        'habitat': '',
        'season': ''
    });

    const [prediction, setPrediction] = useState(null); // State to store the prediction result
    const [error, setError] = useState(null); // State to store any errors
    const [image, setImage] = useState(null); // State to store the selected image
    const [fieldsDisabled, setFieldsDisabled] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Store the selected image file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format the data to match the expected format
        const formattedData = {
            'cap-diameter': [parseFloat(inputs['cap-diameter'])],
            'cap-shape': [inputs['cap-shape']],
            'cap-surface': [inputs['cap-surface']],
            'cap-color': [inputs['cap-color']],
            'does-bruise-or-bleed': [inputs['does-bruise-or-bleed']],
            'gill-attachment': [inputs['gill-attachment']],
            'gill-spacing': [inputs['gill-spacing']],
            'gill-color': [inputs['gill-color']],
            'stem-height': [parseFloat(inputs['stem-height'])],
            'stem-width': [parseFloat(inputs['stem-width'])],
            'stem-root': [inputs['stem-root']],
            'stem-surface': [inputs['stem-surface']],
            'stem-color': [inputs['stem-color']],
            'veil-type': [inputs['veil-type']],
            'veil-color': [inputs['veil-color']],
            'has-ring': [inputs['has-ring']],
            'ring-type': [inputs['ring-type']],
            'spore-print-color': [inputs['spore-print-color']],
            'habitat': [inputs['habitat']],
            'season': [inputs['season']]
        };

        console.log(formattedData); // Inspect the formatted data being sent

        try {
            // Make a POST request to the Flask API
            const response = await axios.post('http://127.0.0.1:8000/predict', formattedData);
            const predictionResult = response.data.predictions; // Assuming the prediction is an array with one value

            const predictionMessage = predictionResult[0] === 1
                ? 'The mushroom is poisonous.'
                : 'The mushroom is not poisonous.';

            Swal.fire({
                title: 'Prediction Result',
                text: predictionMessage,
                icon: 'success',
                confirmButtonText: 'OK'
            });


            setError(null); // Clear any previous errors
            setPrediction(predictionMessage); // Set the prediction result
        } catch (err) {
            // Handle errors
            Swal.fire({
                title: 'Error',
                text: 'Failed to get prediction. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setError('Failed to get prediction. Please try again.');
            setPrediction(null); // Clear any previous predictions
        }
    };


    const handleImageSubmit = async (e) => {
        e.preventDefault();

        // Create FormData object for image
        const formData = new FormData();
        if (image) formData.append('image_file', image);

        try {
            // Make a POST request to upload the image
            const response = await axios.post('http://127.0.0.1:5000/Mushroom-classification-predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const predictionResult = response.data.prediction; // Assuming prediction is returned as text

            console.log(predictionResult)

            Swal.fire({
                title: 'Image Uploaded',
                text: predictionResult,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            // Disable all input fields if prediction is "Not Mushroom"
            if (predictionResult.includes("Not Mushroom")) {
                setFieldsDisabled(true);
            } else {
                setFieldsDisabled(false);
            }


            setError(null); // Clear any previous errors
        } catch (err) {
            // Handle errors
            Swal.fire({
                title: 'Error',
                text: 'Failed to upload image. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setError('Failed to upload image. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Mushroom Prediction</h1>
            <div className="text-center mb-4">
                <img src={mushroomImage} alt="Mushroom" className="img-fluid" style={{ maxWidth: '300px' }} />
            </div>
            <form onSubmit={handleImageSubmit} className="mx-auto mb-5" style={{ maxWidth: '600px' }}>
                <h2 className="text-center mb-4">Upload Mushroom Image</h2>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Select Mushroom Image:</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    {image && (
                        <div className="col-md-6 mt-3">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="img-fluid"
                                style={{ maxWidth: '300px' }}
                            />
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Upload Image</button>
            </form>

            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Cap Diameter (cm):</label>
                        <input type="number" className="form-control" name="cap-diameter" value={inputs['cap-diameter']} onChange={handleChange} disabled={fieldsDisabled} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Cap Shape:</label>
                        <select className="form-control" name="cap-shape" value={inputs['cap-shape']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Cap Shape</option>
                            <option value="bell">Bell</option>
                            <option value="conical">Conical</option>
                            <option value="convex">Convex</option>
                            <option value="flat">Flat</option>
                            <option value="sunken">Sunken</option>
                            <option value="spherical">Spherical</option>
                            <option value="others">Others</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Cap Surface:</label>
                        <select className="form-control" name="cap-surface" value={inputs['cap-surface']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Cap Surface</option>
                            <option value="fibrous">Fibrous</option>
                            <option value="grooves">Grooves</option>
                            <option value="scaly">Scaly</option>
                            <option value="smooth">Smooth</option>
                            <option value="shiny">Shiny</option>
                            <option value="leathery">Leathery</option>
                            <option value="silky">Silky</option>
                            <option value="sticky">Sticky</option>
                            <option value="wrinkled">Wrinkled</option>
                            <option value="fleshy">Fleshy</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Cap Color:</label>
                        <select className="form-control" name="cap-color" value={inputs['cap-color']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Cap Color</option>
                            <option value="brown">Brown</option>
                            <option value="buff">Buff</option>
                            <option value="gray">Gray</option>
                            <option value="green">Green</option>
                            <option value="pink">Pink</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                            <option value="white">White</option>
                            <option value="yellow">Yellow</option>
                            <option value="blue">Blue</option>
                            <option value="orange">Orange</option>
                            <option value="black">Black</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Does Bruise or Bleed:</label>
                        <select className="form-control" name="does-bruise-or-bleed" value={inputs['does-bruise-or-bleed']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Option</option>
                            <option value="t">Bruises or Bleeds</option>
                            <option value="f">No</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Gill Attachment:</label>
                        <select className="form-control" name="gill-attachment" value={inputs['gill-attachment']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Gill Attachment</option>
                            <option value="adnate">Adnate</option>
                            <option value="adnexed">Adnexed</option>
                            <option value="decurrent">Decurrent</option>
                            <option value="free">Free</option>
                            <option value="sinuate">Sinuate</option>
                            <option value="pores">Pores</option>
                            <option value="none">None</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Gill Spacing:</label>
                        <select className="form-control" name="gill-spacing" value={inputs['gill-spacing']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Gill Spacing</option>
                            <option value="close">Close</option>
                            <option value="distant">Distant</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Gill Color:</label>
                        <select className="form-control" name="gill-color" value={inputs['gill-color']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Gill Color</option>
                            <option value="brown">Brown</option>
                            <option value="buff">Buff</option>
                            <option value="gray">Gray</option>
                            <option value="green">Green</option>
                            <option value="pink">Pink</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                            <option value="white">White</option>
                            <option value="yellow">Yellow</option>
                            <option value="blue">Blue</option>
                            <option value="orange">Orange</option>
                            <option value="black">Black</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Stem Height (cm):</label>
                        <input type="number" className="form-control" name="stem-height" value={inputs['stem-height']} onChange={handleChange} disabled={fieldsDisabled} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Stem Width (cm):</label>
                        <input type="number" className="form-control" name="stem-width" value={inputs['stem-width']} onChange={handleChange} disabled={fieldsDisabled} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Stem Root:</label>
                        <select className="form-control" name="stem-root" value={inputs['stem-root']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Stem Root</option>
                            <option value="bulbous">Bulbous</option>
                            <option value="club-shaped">Club-shaped</option>
                            <option value="cylindrical">Cylindrical</option>
                            <option value="tapering">Tapering</option>
                            <option value="rooted">Rooted</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Stem Surface:</label>
                        <select className="form-control" name="stem-surface" value={inputs['stem-surface']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Stem Surface</option>
                            <option value="fibrous">Fibrous</option>
                            <option value="smooth">Smooth</option>
                            <option value="scaly">Scaly</option>
                            <option value="rough">Rough</option>
                            <option value="dry">Dry</option>
                            <option value="wet">Wet</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Stem Color:</label>
                        <select className="form-control" name="stem-color" value={inputs['stem-color']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Stem Color</option>
                            <option value="brown">Brown</option>
                            <option value="buff">Buff</option>
                            <option value="gray">Gray</option>
                            <option value="green">Green</option>
                            <option value="pink">Pink</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                            <option value="white">White</option>
                            <option value="yellow">Yellow</option>
                            <option value="blue">Blue</option>
                            <option value="orange">Orange</option>
                            <option value="black">Black</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Veil Type:</label>
                        <select className="form-control" name="veil-type" value={inputs['veil-type']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Veil Type</option>
                            <option value="partial">Partial</option>
                            <option value="universal">Universal</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Veil Color:</label>
                        <select className="form-control" name="veil-color" value={inputs['veil-color']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Veil Color</option>
                            <option value="brown">Brown</option>
                            <option value="buff">Buff</option>
                            <option value="gray">Gray</option>
                            <option value="green">Green</option>
                            <option value="pink">Pink</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                            <option value="white">White</option>
                            <option value="yellow">Yellow</option>
                            <option value="blue">Blue</option>
                            <option value="orange">Orange</option>
                            <option value="black">Black</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Has Ring:</label>
                        <select className="form-control" name="has-ring" value={inputs['has-ring']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Option</option>
                            <option value="t">Yes</option>
                            <option value="f">No</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Ring Type:</label>
                        <select className="form-control" name="ring-type" value={inputs['ring-type']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Ring Type</option>
                            <option value="none">None</option>
                            <option value="evanescent">Evanescent</option>
                            <option value="flaring">Flaring</option>
                            <option value="pendant">Pendant</option>
                            <option value="sheathing">Sheathing</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Spore Print Color:</label>
                        <select className="form-control" name="spore-print-color" value={inputs['spore-print-color']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Spore Print Color</option>
                            <option value="black">Black</option>
                            <option value="brown">Brown</option>
                            <option value="buff">Buff</option>
                            <option value="green">Green</option>
                            <option value="pink">Pink</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                            <option value="white">White</option>
                            <option value="yellow">Yellow</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Habitat:</label>
                        <select className="form-control" name="habitat" value={inputs['habitat']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Habitat</option>
                            <option value="grass">Grass</option>
                            <option value="forest">Forest</option>
                            <option value="woodland">Woodland</option>
                            <option value="urban">Urban</option>
                            <option value="wetland">Wetland</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Season:</label>
                        <select className="form-control" name="season" value={inputs['season']} onChange={handleChange} disabled={fieldsDisabled} >
                            <option value="">Select Season</option>
                            <option value="spring">Spring</option>
                            <option value="summer">Summer</option>
                            <option value="fall">Fall</option>
                            <option value="winter">Winter</option>
                            <option value="all">All Year</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">Predict</button>
            </form>

        </div>
    );
};

export default Prediction;
