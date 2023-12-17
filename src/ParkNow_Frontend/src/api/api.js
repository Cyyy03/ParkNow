import { getUser } from "../utils/storage";

let Cookie = "";
async function http(url, params, method,form) {
  console.log("params", params);
  console.log("Cookie", Cookie);
  let user = await getUser();
  // http://10.0.6.90:8000
  let res = await fetch("http://192.168.0.51:8000" + url, {
    method: method || "post",
    body: method=="GET"?null:(form?params:JSON.stringify(params)),
    credentials: "include",
    headers: {
      "Content-Type": form? 'application/x-www-form-urlencoded':"application/json",
      Cookie: Cookie,
      Authorization: user ? user.token : "",
    },
  }).then(function (response) {
    //response.status represents the http status code of the response
    console.log("data222", response);
    if (response.headers) {
      // Cookie = response.headers.map["set-cookie"];
      // console.log('Cookie====', Cookie);
    }

    if (response.status === 200) {
      //json is a method provided by the returned response. It will deserialize the returned json string into an object and wrap it into a Promise.
      return response.json();
    } else {
      return response.json();
    }
  });
  // if (res.status != 200) {
  //   Toast.show(res.message);
  // }
  console.log("data", res);
  return res;
}


// export async function getUser(params) {
//   let res = await http("/users/login/", params);
//   return res;
// }

export async function login(params) {
  let res = await http("/users/login/", params);
  return res;
}

export async function register(params) {
  let res = await http("/users/register/", params);
  return res;
}

export async function verify_email(params) {
  let res = await http("/users/verify_email/", params);
  return res;
}

export async function send_otp(params) {
  let res = await http("/users/send_otp/", params);
  return res;
}

export async function verify_otp(params) {
  let res = await http("/users/verify_otp/", params);
  return res;
}
export async function update_email(userid,params) {
  let res = await http(`/users/${userid}/update_email/`, params);
  return res;
}


export async function update_password(userid,params) {
  let res = await http(`/users/${userid}/update_password/`, params);
  return res;
}
export async function search(address,max_distance) {
  let res = await http(`/search/?query=${address}&max_distance=${max_distance}`, {},"GET");
  return res;
}
export async function distancef(params) {
  let res = await http(`/navigate/distancef`, params,"POST",true);
  return res;
}
export async function getCarpark(CarParkID) {
  let res = await http(`/carpark/${CarParkID}/`, null,"GET");
  return res;
}
export async function navigateRoute(source_lat,source_lng,dest_lat,dest_lng) {
  let res = await http(`/navigate/f/${source_lat},${source_lng},${dest_lat},${dest_lng}/`, null,"GET");
  return res;
}
export async function directionsf(params) {
  let res = await http(`/navigate/directionsf`, params,"POST",true);
  return res;
}
export async function mapf(params) {
  let res = await http(`/navigate/mapf`, params,"GET");
  return res;
}

