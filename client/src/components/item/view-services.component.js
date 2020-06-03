import React, { Component } from "react";
import DeptService from "../../services/dept.service";
import AuthService from "../../services/auth.service";

import { Link } from "react-router-dom";

export default class ServicesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.retrieveServices = this.retrieveServices.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveService = this.setActiveService.bind(this);
    // this.removeAllItems = this.removeAllItems.bind(this);
    this.searchName = this.searchName.bind(this);

    this.state = {
      service: [],
      currentservice: null,
      currentIndex: -1,
      searchName: "",
      showStudentBoard: false,
    };
  }

  componentDidMount() {
    this.retrieveServices();
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        showStudentBoard: user.roles.includes("ROLE_STUDENT"),
      });
    }
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName,
    });
  }

  retrieveServices() {
    DeptService.getall()
      .then((response) => {
        this.setState({
          service: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveServices();
    this.setState({
      currentservice: null,
      currentIndex: -1,
    });
  }

  setActiveService(service, index) {
    this.setState({
      currentservice: service,
      currentIndex: index,
    });
  }

  // removeAllItems() {
  //     ItemDataService.deleteAll()
  //         .then(response => {
  //             console.log(response.data);
  //             this.refreshList();
  //         })
  //         .catch(e => {
  //             console.log(e);
  //         });
  // }

  searchName() {
    DeptService.findByName(this.state.searchName)
      .then((response) => {
        this.setState({
          service: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const {
      searchName,
      service,
      currentservice,
      currentIndex,
      showStudentBoard,
    } = this.state;

    return (
      <div className="container">
        <div className="list row">
          <div className="col-md-8">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control mr-sm-2"
                placeholder="Search by Service name"
                value={searchName}
                onChange={this.onChangeSearchName}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="button"
                  onClick={this.searchName}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h4>Services List</h4>

            <ul className="list-group">
              {service &&
                service.map((service, index) => (
                  <li
                    className={
                      "list-group-item " +
                      (index === currentIndex ? "active" : "")
                    }
                    onClick={() => this.setActiveService(service, index)}
                    key={index}
                  >
                    {service.service_name}
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-md-6">
            {currentservice ? (
              <div>
                <h4>Service</h4>
                <div>
                  <label>
                    <strong>Service number:</strong>
                  </label>{" "}
                  {currentservice.service_no}
                </div>
                <div>
                  <label>
                    <strong>Service name:</strong>
                  </label>{" "}
                  {currentservice.service_name}
                </div>
                <div>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {currentservice.description}
                </div>

                <div>
                  <label>
                    <strong>Status:</strong>
                  </label>{" "}
                  {currentservice.availability ? "Available" : "Not available"}
                </div>
                {!showStudentBoard ? (
                  <Link
                    to={"/service/edit" + currentservice.id}
                    className="badge badge-warning"
                  >
                    Edit
                  </Link>
                ) : (
                  <Link to={"/service/Cart"} className="badge badge-warning">
                    Request The Service
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <br />
                <p>Please click on a Service...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
