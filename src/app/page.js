'use client'
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import instance from "@/lib/axios";
import {getToken} from "@/utils/tokens";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";

import dynamic from 'next/dynamic';

const DynamicComponents = {
  MDBContainer: dynamic(() =>
      import('mdb-react-ui-kit').then((module) => module.MDBContainer)
  ),
  MDBRow: dynamic(() =>
      import('mdb-react-ui-kit').then((module) => module.MDBRow)
  ),
  MDBCol: dynamic(() =>
      import('mdb-react-ui-kit').then((module) => module.MDBCol)
  ),
  MDBCard: dynamic(() =>
      import('mdb-react-ui-kit').then((module) => module.MDBCard)
  ),
  MDBCardBody: dynamic(() =>
      import('mdb-react-ui-kit').then((module) => module.MDBCardBody)
  ),
  MDBIcon: dynamic(() =>
      import('mdb-react-ui-kit').then((module) => module.MDBIcon)
  ),
  MDBTypography: dynamic(() =>
      import('mdb-react-ui-kit').then((module) => module.MDBTypography)
  ),
  MDBInputGroup: dynamic(() =>
      import('mdb-react-ui-kit').then((module) => module.MDBInputGroup)
  ),
};

export default function Page(options) {
  const [currentProject, setCurrentProject] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm()
  const router = useRouter();

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
    }
  }, []);

  const fetchProjects = async () => {
    const response = await instance.get('/projects');
    return response.data;
  };

  const {data: projects} = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const fetchChatMessages = async () => {
    const response = await instance.get(`/projects/${currentProject?.id}/chat/history`);
    return response.data;
  };
  const {data: chatMessages} = useQuery({
    queryKey: ['chatMessages', currentProject?.id],
    queryFn: fetchChatMessages,
    refetchInterval: 1000,
    enabled: !!currentProject
  });

  const sendMessageMutation = useMutation((formData) =>
          instance.post('/projects/4/chat', formData).then((response) => response.data), {
        onSuccess: (data) => {
          reset();
        }
      }
  );

  const handleSendMessage = async (data) => {
    reset();
    sendMessageMutation.mutate({
      "chat": {
        "message": data.message
      }
    });
  };

  const handleProjectClick = (project) => {
    setCurrentProject(project);
  };

  return (
      <div className="py-5 container-fluid" style={{ backgroundColor: "#CDC4F9", height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <div className="col-md-12">
            <div className="card" id="chat3" style={{ borderRadius: "15px", height: "100%" }}>
              <div className="card-body">
                <div className="row" style={{ height: "100%" }}>
                  <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                    <div className="p-3">
                      <ul className="list-unstyled">
                        {projects?.projects?.map((project) => {
                          return (
                              <li
                                  className="p-2 border-bottom"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleProjectClick(project)}
                              >
                                <div className="d-flex flex-row">
                                  <div className="pt-1">
                                    <p className="fw-bold mb-0">{project.name}</p>
                                    <p className="small text-muted">{project.context}</p>
                                  </div>
                                </div>
                              </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-7 col-xl-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <div className="overflow-scroll" style={{ maxHeight: "76vw" }}>
                      {chatMessages?.chat?.map((chatMessage) => {
                        if (chatMessage.role !== "user") {
                          return (
                              <div className="d-flex flex-row justify-content-start">
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp" alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                <div>
                                  <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: "#f5f6f7" }}>{chatMessage.content}</p>
                                </div>
                              </div>
                          )
                        }
                        return (
                            <div className="d-flex flex-row justify-content-end">
                              <div>
                                <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">{chatMessage.content}</p>
                              </div>
                              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                            </div>
                        )
                      })}
                    </div>
                    <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp" alt="avatar 3" style={{ width: "40px", height: "100%" }} />
                      <form onSubmit={handleSubmit(handleSendMessage)} method="post" style={{ width: '100%' }}>
                        <input
                            type="text"
                            {...register("message", { required: true })}
                            className="form-control form-control-lg"
                            id="exampleFormControlInput2"
                            placeholder="Type message"
                        />
                      </form>
                      <a className="ms-3" href="#!">
                        <i className="fas fa-paper-plane"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}