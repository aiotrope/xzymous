import React, { useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useParams, Link } from 'react-router-dom'
import { sanitize } from 'isomorphic-dompurify'
import axios from 'axios'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import Container from 'react-bootstrap/Container'

import { toast } from 'react-toastify'

import { UpdateForm } from './UpdateForm'
import { Updated } from './Updated'
import { postService } from '../../services/post'
import { posts_atom, post_atom } from '../../recoil/post'
import { jwt_atom } from '../../recoil/auth'
import Loader from '../Misc/Loader'

export const UpdateSnippet = () => {
  const queryClient = useQueryClient()

  const { id } = useParams()

  const setPosts = useSetRecoilState(posts_atom)

  const setPost = useSetRecoilState(post_atom)

  const access = useRecoilValue(jwt_atom)

  const post = useRecoilValue(post_atom)

  const postQuery = useQuery([`post-${id}`, id], () => postService.getPostById(id))

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getAll,
  })

  const baseUrl = process.env.REACT_APP_BASE_URL

  const updateMutation = useMutation({
    mutationFn: async (data) =>
      await axios.patch(`${baseUrl}/api/post/${id}`, data, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({
        queryKey: ['posts', `post-${id}`, 'post', 'user', 'user'],
      })
    },
  })

  const schema = yup.object({
    title: yup.string().min(5).default(post?.title).notRequired(),
    description: yup.string().min(10).default(post?.description).notRequired(),
    entry: yup.string().min(10).required().default(post?.entry).notRequired(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  useEffect(() => {
    let defaultValues = {}
    defaultValues.title = post?.title
    defaultValues.description = post?.description
    defaultValues.entry = post?.entry
    reset({ ...defaultValues })
  }, [post?.description, post?.entry, post?.title, reset])

  useEffect(() => {
    let mounted = true

    const preparePosts = async () => {
      if (postsQuery.data && mounted) {
        setPosts(postsQuery.data)
      }
    }
    preparePosts()

    return () => {
      mounted = false
    }
  }, [postsQuery.data, setPosts])

  useEffect(() => {
    let mounted = true

    const preparePost = async () => {
      if (postQuery.data && mounted) {
        setPost(postQuery.data)
      }
    }
    preparePost()

    return () => {
      mounted = false
    }
  }, [postQuery.data, setPost])

  const onSubmit = async (formData) => {
    try {
      const sanitzeData = {
        title: sanitize(formData.title),
        description: sanitize(formData.description),
        entry: sanitize(formData.entry),
      }
      const result = await updateMutation.mutateAsync(sanitzeData)
      //console.log(result)
      if (result) {
        toast.success(result.data.message, { theme: 'colored' })
        setPost(result.data.post)
      }
    } catch (err) {
      toast.error(err.response.data.error, { theme: 'colored' })
    }
  }

  if (updateMutation.isLoading || postQuery.isLoading || postsQuery.isLoading) return <Loader />

  if (postQuery.isFetching || postsQuery.isFetching) return <Loader />

  return (
    <Container className="col-md-9 mx-auto">
      <h2>Update Snippet </h2>
      <p>
        Update snippet:{' '}
        <Link to={`/snippet/${post?.id}`} className="text-primary">
          {post?.title}
        </Link>
      </p>
      <p>
        Posted by:{' '}
        <Link to={`/user/${post?.user?.id}`} className="text-primary">
          {post?.user?.username}
        </Link>
      </p>
      <p>All fields are optional.</p>
      <UpdateForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        reset={reset}
        updateMutation={updateMutation}
      />
      <div>
        <h3>Snippet to be updated</h3>
        <Updated post={post} />
      </div>
    </Container>
  )
}