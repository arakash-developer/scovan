import { useEffect, useState } from "react";
import { Card } from "antd";
import MCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Home() {
  const [course, setCourse] = useState([]);
  const [subCourse, setSubCourse] = useState([]);
  const handleDepartment = (id) => {
    if (id) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `hello/backend/course/showwithdepartment`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { departmentId: id },
      };

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setSubCourse(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <Card title="Home Page">
        <div>
          <div className="main-box">
            {course.length !== 0 ? (
              course.map((el, index) => (
                <NavLink to={`/chat/${el._id}`} key={index}>
                  <MCard sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {el.title}
                      </Typography>
                    </CardContent>
                  </MCard>
                </NavLink>
              ))
            ) : (
              <MCard sx={{ width: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography gutterBottom variant="h3" component="div">
                    Welcome to our Admin Panel.
                  </Typography>
                </CardContent>
              </MCard>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Home;
