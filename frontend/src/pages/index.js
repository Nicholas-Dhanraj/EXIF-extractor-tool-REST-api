import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const homePage = () => {
  const [image, setImage] = useState(null);
  const [name, setAltText] = useState("");
  const [images, setImages] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [blob, setBlobs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          Accept: "application/json",
        },
      };

      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/image/fetch-images",
          config
        );

        if (res.status === 200) {
          setImages(res.data.images);
          setBlobs(res.blob);
        }
      } catch (err) {}
    };

    fetchData();
  }, [updated]);

  const onFileChange = (e) => setImage(e.target.files[0]);
  const onTextChange = (e) => setAltText(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("image", image);
    formData.append("alt_text", name);

    const body = formData;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/image/upload",
        body,
        config
      );

      if (res.status === 201) {
        setUpdated(!updated);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      const config = { responseType: "blob" };

      try {
        const res = await axios
          .get("http://127.0.0.1:8000/api/image/fetch-images", config)
          .then((response) => {
            setBlobs(response);
          });
      } catch (err) {}
    };

    fetchData();
  }, [updated]);

  //console.log(blob);
  const getExif = (e, i) => {
    // var file = images[i];
    // var reader = new FileReader();
    // reader.onload = async function (e) {
    //   console.time("read exif");
    //   const exifObj = piexif.load(e.target.result);
    //   setCurrImage(e.target.result);
    //   setCurrExif(exifObj);
    //   let exifArr = [];
    //   // read latitude
    //   const lat = piexif.GPSHelper.dmsRationalToDeg(
    //     exifObj["GPS"][piexif.GPSIFD.GPSLatitude],
    //     exifObj["GPS"][piexif.GPSIFD.GPSLatitudeRef]
    //   );
    //   // read longitude
    //   const long = piexif.GPSHelper.dmsRationalToDeg(
    //     exifObj["GPS"][piexif.GPSIFD.GPSLongitude],
    //     exifObj["GPS"][piexif.GPSIFD.GPSLongitudeRef]
    //   );
    //   const make = exifObj["0th"][piexif.ImageIFD.Make] || "";
    //   exifArr.push(`Make: ${make}`);
    //   const model = exifObj["0th"][piexif.ImageIFD.Model] || "";
    //   exifArr.push(`Model: ${model}`);
    //   const osVersion = exifObj["0th"][piexif.ImageIFD.Software] || "";
    //   exifArr.push(`OS version: ${osVersion}`);
    //   exifArr.push(`Latitude: ${lat}`);
    //   exifArr.push(`Longitude: ${long}`);
    //   const dateTime = exifObj["0th"][piexif.ImageIFD.DateTime] || "";
    //   const dateTimeOriginal =
    //     exifObj["Exif"][piexif.ExifIFD.DateTimeOriginal] || "";
    //   const subsecTimeOriginal =
    //     exifObj["Exif"][piexif.ExifIFD.SubSecTimeOriginal] || "";
    //   exifArr.push(`DateTime: ${dateTime}`);
    //   exifArr.push(
    //     `DateTimeOriginal: ${dateTimeOriginal}.${subsecTimeOriginal}`
    //   );
    //   setValues({
    //     make: make,
    //     model: model,
    //     osVersion: osVersion,
    //     lat: lat,
    //     long: long,
    //     dateTime: dateTime,
    //   });
    //   setExifData(exifArr);
    //   console.timeEnd("read exif");
    // };
    // reader.readAsDataURL(file);
    // setUpdated(true);
  };
  return (
    <div className="container mt-5">
      <h1 className="display-4 mt-5 mb-5">EXIF data extractor/modifier tool</h1>
      <div className="row">
        <div className="col-5">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="image">
                Image Upload
              </label>
              <input
                className="form-control"
                type="file"
                name="image"
                onChange={onFileChange}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label className="form-label" htmlFor="alt_text">
                Alt Text
              </label>
              <input
                className="form-control"
                type="text"
                name="alt_text"
                onChange={onTextChange}
                value={name}
                required
              />
            </div>
            <button className="btn btn-success mt-3" type="submit">
              Upload Image
            </button>
          </form>
        </div>
        <div className="offset-1 col-6">
          <h3 className="mb-5">My Uploaded Images:</h3>
          <div>
            {images !== null &&
              images.map((image, idx) => (
                <div key={idx}>
                  <div key={image.id}>
                    <Image
                      width={200}
                      height={150}
                      src={`http://127.0.0.1:8000${image.image}`}
                      alt={image.alt_text}
                    />
                  </div>
                  <button className="mb-5" onClick={(e) => getExif(e, idx)}>
                    Get EXIF
                  </button>
                  {console.log(`http://127.0.0.1:8000${image.image}`)}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default homePage;
