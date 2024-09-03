import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Textbox } from "../components";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleRegister = async (data) => {
    try {
      // Determine if the user is an admin based on the role
      const isAdmin = data.role.toLowerCase() === "admin";
      
      const res = await registerUser({ ...data, isAdmin }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Registration successful!");
      navigate("/dashboard"); // Ensure this path is correct
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className='w-full max-w-md flex flex-col gap-y-8 bg-white p-10 rounded shadow-md'
      >
        <h2 className='text-3xl font-bold text-center'>Register</h2>
        <Textbox
          placeholder='Full Name'
          type='text'
          name='name'
          label='Full Name'
          register={register("name", {
            required: "Full Name is required!",
          })}
          error={errors.name ? errors.name.message : ""}
        />
        <Textbox
          placeholder='Email Address'
          type='email'
          name='email'
          label='Email Address'
          register={register("email", {
            required: "Email Address is required!",
          })}
          error={errors.email ? errors.email.message : ""}
        />
        <Textbox
          placeholder='Password'
          type='password'
          name='password'
          label='Password'
          register={register("password", {
            required: "Password is required!",
          })}
          error={errors.password ? errors.password.message : ""}
        />
        <Textbox
          placeholder='Role'
          type='text'
          name='role'
          label='Role'
          register={register("role", {
            required: "Role is required!",
          })}
          error={errors.role ? errors.role.message : ""}
        />
        <Textbox
          placeholder='Title'
          type='text'
          name='title'
          label='Title'
          register={register("title", {
            required: "Title is required!",
          })}
          error={errors.title ? errors.title.message : ""}
        />
        <Button type='submit' label='Register' className='w-full h-10 bg-blue-700 text-white rounded-full' />
      </form>
    </div>
  );
};

export default Register;
