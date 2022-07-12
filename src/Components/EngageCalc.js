import { Box, Button, Card, Grid, TextField, Typography, CardMedia, Paper } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
const EngageCalc = () => {
  let posts = []
  const [allPosts, setAllPosts] = useState([])
  const [profilePic, setProfilePic] = useState("")
  let cursorKey = ""
  let likes = 0
  let comments = 0
  const [totalComments, setTotalComments] = useState(0)
  const [totalLikes, setTotalLikes] = useState(0)
  const [followers, setFollowers] = useState(0)
  const [postNo, setPostNo] = useState(0)
  const [user,setUser]=useState("")
  useEffect(() => {
  }, [likes, comments])

  const fetchdata = () => {
    let options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '1ec2acfea8mshb104f339e4ee10ap1d1da2jsnd95892a95fd9',
        'X-RapidAPI-Host': 'instagram-scraper-data.p.rapidapi.com'
      }
    };

    fetch(`https://instagram-scraper-data.p.rapidapi.com/userinfo/${user}`, options)
      .then(response => response.json())
      .then(function (data) {
        var secondId = data.data.id
        setProfilePic(data.data.profile_pic_url)
        setFollowers(data.data.edge_followed_by.count)
        setPostNo(data.data.edge_owner_to_timeline_media.count)
        console.log(data)
        return fetch(`https://instagram-scraper-data.p.rapidapi.com/userpost/${secondId}/50/%7Bend_cursor%7D`, options)
          .then(response => response.json())
          .then(response => {
            posts = response.data.edges
            cursorKey = response.data.end_cursor
            console.log(posts, cursorKey)
            fetchdata1(cursorKey)
          })
          .catch(err => console.error(err));
      })
  }

  const fetchdata1 = (cursorKey) => {
    if (cursorKey === "") {
      console.log(posts)
      setAllPosts(posts)
      posts.map((post) => {
        likes = likes + post.node.edge_media_preview_like.count
        comments = comments + post.node.edge_media_to_comment.count
      })
      setTotalLikes(likes)
      setTotalComments(comments)
    }
    else {
      let options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '1ec2acfea8mshb104f339e4ee10ap1d1da2jsnd95892a95fd9',
          'X-RapidAPI-Host': 'instagram-scraper-data.p.rapidapi.com'
        }
      };

      fetch(`https://instagram-scraper-data.p.rapidapi.com/userinfo/${user}`, options)
        .then(response => response.json())
        .then(function (data) {
          let secondId = data.data.id
          return fetch(`https://instagram-scraper-data.p.rapidapi.com/userpost/${secondId}/50/${cursorKey}`, options)
            .then(response => response.json())
            .then(response => {
              posts = posts.concat(response.data.edges)
              cursorKey = response.data.end_cursor
              fetchdata1(cursorKey)
            })
            .catch(err => console.error(err));
        })
    }
  }
  const findUser=(e)=>{
    let user=e.target.value
    setUser(user)
  }
  return (
    <>
      <Box style={{display:'flex',alignItems:'center',justifyContent:'center', height: "30vh", background: "linear-gradient(101.29deg, rgba(136, 53, 167, 0.11) -15.27%, #DC42A5 9.02%, #D64AB7 41.79%, #DD209C 60.73%, #E93772 77.09%)" }}>
        <Typography sx={{color:'white',fontFamily:'Poppins',fontWeight:'700'}} variant='h5'>Instagram Engagement Rate Calculator</Typography>
      </Box>
      <Paper style={{ backgroundColor: 'white', margin: '-5% 10% 5%' }}>
        <Grid container sx={{ padding: '3%' }}>
          <Grid item xs={9} >
            <TextField sx={{ width: '100%', borderRadius: '10px' }} onChange={findUser}></TextField>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={fetchdata} sx={{ fontFamily:'Poppins',backgroundColor: '#D22696', width: '90%', height: '100%', color: 'white', "&:hover": { backgroundColor: 'white', color: '#D22696', border: '2PX solid #D22696' }, borderRadius: '10px' }}>Calculate</Button>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ margin: '3%' }}>
        <Paper elevation={2} sx={{minHeight:'7vh',padding:'2%'}}>
          <Grid container sx={{padding:'5%'}}>
            <Grid item sx={{ display: 'flex', flexDirection: 'column',alignItems:'center',justifyContent:'center' }} xs={3}>
              <img src={profilePic.slice(1, -1)} style={{ borderRadius: '50%' }} />
            </Grid>
            <Grid item sx={{ display: 'flex', flexDirection: 'column',alignItems:'center',justifyContent:'center' }} xs={3}>
              <Typography sx={{fontFamily: 'Poppins'}}>Overall Engagement Rate</Typography>
              <Typography sx={{fontFamily: 'Poppins',fontSize:'7vh',fontWeight:'700'}}>{(((totalLikes + totalComments) / followers) * 100).toFixed(2)}%</Typography>
            </Grid>
            <Grid item sx={{ display: 'flex', flexDirection: 'column',alignItems:'center',justifyContent:'center' }} xs={3}>
              <Typography sx={{fontFamily: 'Poppins'}}>Average Likes/post</Typography>
              <Typography sx={{fontFamily: 'Poppins',fontSize:'7vh',fontWeight:'700'}}>{(totalLikes / postNo).toFixed(0)}</Typography>
            </Grid>
            <Grid item sx={{ display: 'flex', flexDirection: 'column',alignItems:'center',justifyContent:'center' }} xs={3}>
              <Typography sx={{fontFamily: 'Poppins'}}>Average Comments/post</Typography>
              <Typography sx={{fontFamily: 'Poppins',fontSize:'7vh',fontWeight:'700'}}>{(totalComments / postNo).toFixed(0)}</Typography>
            </Grid>
          </Grid>
          <hr/>
          <Grid container rowSpacing={3} columnSpacing={3}>
            {
              allPosts.map((post, index) => {
                return <Grid item key={index} xs={4}>
                  <Card>
                    <CardMedia component="img" image={post.node.display_url} sx={{ border: 'none' }} ></CardMedia>
                    <Grid container>
                      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                        <StarIcon /> {(((post.node.edge_media_preview_like.count + post.node.edge_media_to_comment.count) / followers) * 100).toFixed(2)}
                      </Grid>
                      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                        <FavoriteIcon /> {post.node.edge_media_preview_like.count}
                      </Grid>
                      <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                        <ChatBubbleIcon />{post.node.edge_media_to_comment.count}
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              })
            }
          </Grid>
        </Paper>
      </Box>

    </>
  )
}

export default EngageCalc