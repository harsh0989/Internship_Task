import { Box, Button, Card, Grid, TextField, Typography, CardMedia } from '@mui/material'
import React, { useState } from 'react'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
const EngageCalc = () => {
  let posts = []
  const [allPosts, setAllPosts] = useState([])
  const [profilePic, setProfilePic] = useState("")
  let cursorKey = ""
  const fetchdata = () => {
    let options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'e2fc8737famsh8acd11d3eda8627p1ca713jsn2e8fcd19ad2e',
        'X-RapidAPI-Host': 'instagram-scraper-data.p.rapidapi.com'
      }
    };

    fetch('https://instagram-scraper-data.p.rapidapi.com/userinfo/shahzamk', options)
      .then(response => response.json())
      .then(function (data) {
        var secondId = data.data.id
  setProfilePic(data.data.profile_pic_url)
        console.log(secondId)
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
      console.log(allPosts)
    }
    else {
      let options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'e2fc8737famsh8acd11d3eda8627p1ca713jsn2e8fcd19ad2e',
          'X-RapidAPI-Host': 'instagram-scraper-data.p.rapidapi.com'
        }
      };

      fetch('https://instagram-scraper-data.p.rapidapi.com/userinfo/shahzamk', options)
        .then(response => response.json())
        .then(function (data) {
          var secondId = data.data.id
          console.log(secondId)
          return fetch(`https://instagram-scraper-data.p.rapidapi.com/userpost/${secondId}/50/${cursorKey}`, options)
            .then(response => response.json())
            .then(response => {
              console.log(response.data.edges)
              // setPosts([...posts, response.data.edges])
              posts = posts.concat(response.data.edges)
              cursorKey = response.data.end_cursor
              console.log(response)
              fetchdata1(cursorKey)
            })
            .catch(err => console.error(err));
        })
    }
  }
  console.log(posts)
  return (
    <>
      <Box style={{ height: "30vh", background: "linear-gradient(101.29deg, rgba(136, 53, 167, 0.11) -15.27%, #DC42A5 9.02%, #D64AB7 41.79%, #DD209C 60.73%, #E93772 77.09%)" }}></Box>
      <Box style={{ backgroundColor: 'white', margin: '-5% 10% 5%' }}>
        <Grid container sx={{ padding: '3%' }}>
          <Grid item xs={9} >
            <TextField sx={{ width: '100%', borderRadius: '10px' }}></TextField>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={fetchdata} sx={{ backgroundColor: '#D22696', width: '90%', height: '100%', color: 'white', "&:hover": { backgroundColor: 'white', color: '#D22696', border: '2PX solid #D22696' }, borderRadius: '10px' }}>Calculate</Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ margin: '3%' }}>
        <Grid container rowSpacing={3} columnSpacing={3}>
          {
            allPosts.map((post, index) => {
              return <Grid item key={index} xs={4}>
                <Card>
                  <CardMedia component="img" image={post.node.display_url}></CardMedia>
                  <Grid container>
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                      <StarIcon /> {post.node.edge_media_preview_like.count}
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
      </Box>

    </>
  )
}

export default EngageCalc