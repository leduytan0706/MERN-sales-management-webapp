import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.util.js";
import userRoles from "../utils/userRoles.js";
import cloudinary from "../lib/cloudinary.js";


const logIn = async (req,res) => {
    const {authInfo, password} = req.body;
    // Kiểm tra input
    if (!authInfo || !password) {
        return res.status(400).json({
            message: 'Yêu cầu điền tất cả các mục.'
        });
    }

    let existingUser;
    try {
        // Kiểm tra email hoặc tên đăng nhập đã tồn tại hay chưa
        existingUser = await User.findOne({$or: [
            {email: authInfo},
            {username: authInfo}
        ]});
        if (!existingUser) {
            return res.status(404).json({
                message: 'Thông tin đăng nhập không hợp lệ.'
            });
        }

        // So sánh mật khẩu nhập vào với mật khẩu trong hệ thống
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch){
            return res.status(404).json({
                message: 'Thông tin đăng nhập không hợp lệ.'
            });
        }

        // cung cấp token và thêm vào cookie để xác thực truy cập
        const token = generateToken(existingUser._id, res);
        
    } catch (error) {
        console.log(`Error in logIn controller: ${error.message}`);
        return res.status(500).json({
            message: 'Lỗi máy chủ. Hãy thử lại sau.'
        });
    }

    return res.status(200).json({
        id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        avatar: existingUser.avatar,
        roles: existingUser.roles,
        phoneNumber: existingUser.phoneNumber,
        createdAt: existingUser.createdAt
    });
};

const getUsers = async (req,res) => {
    let existingUsers;
    try {
        existingUsers = await User.find().select('-password');

    } catch (error) {
        console.log(`Error in logIn controller: ${error.message}`);
        return res.status(500).json({
            message: 'Lỗi máy chủ. Hãy thử lại sau.'
        });
    }

    if (!existingUsers || existingUsers.length <= 0){
        return res.status(404).json({ message: 'Không có người dùng trong hệ thống.' });
    }

    return res.status(200).json(existingUsers.map(user => user.toObject({getters: true})));
};

const addUser = async (req,res) => {
    if (req.user.username == 'leduytan0706') {
        return res.status(403).json({ message: 'Tài khoản demo không được thực hiện thao tác này.' });
    }

    const {userData} = req.body;
    const {email, password, username, avatar, employeeRoles, phoneNumber} = userData;

    // Kiểm tra thông tin gửi
    if (!email || !password || !employeeRoles) {
        return res.status(400).json({
            message: 'Yêu cầu điền tất cả các mục.'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: 'Mật khẩu cần ít nhất 8 kí tự.'
        });
    }

    // Nếu quyền/vai trò không có trong hệ thống
    if (!employeeRoles.every(role => userRoles.includes(role))){
        return res.status(400).json({message: 'Vai trò không hợp lệ.'});
    }

    let acceptedRoles;
    // Quản lý bao gồm tất cả các quyền
    if (employeeRoles.includes("manager")){
        acceptedRoles = [...userRoles]
    }
 
    let newUser;
    try {
        // Kiểm tra email hoặc tên đăng nhập đã tồn tại hay chưa
        const existingUser = await User.findOne({$or: [
            {email},
            {username}
        ]});
        
        if (existingUser){
            return res.status(400).json({
                message: 'Email hoặc tên người dùng đã tồn tại.'
            });
        }

        let userAvatar;
        // Thêm ảnh đại diện lên cloudinary
        if (avatar){
            const uploadResult = await cloudinary.uploader.upload(avatar);
            userAvatar = uploadResult.secure_url;
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // Tạo người dùng mới
        newUser = new User({
            email,
            username,
            password: hashedPassword,
            roles: acceptedRoles || employeeRoles,
            avatar: userAvatar,
            phoneNumber
        });

        await newUser.save();
        
    } catch (error) {
        console.log(`Error in addUser controller: ${error.message}`);
        return res.status(500).json({
            message: 'Lỗi máy chủ. Hãy thử lại sau.'
        });
    }

    return res.status(201).json({
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        roles: newUser.roles,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
        phoneNumber: newUser.phoneNumber
    });
};

const deleteUser = async (req,res) => {
    if (req.user.username == 'leduytan0706') {
        return res.status(403).json({ message: 'Tài khoản demo không được thực hiện thao tác này.' });
    }

    const userId = req.params.id;
    if (!userId) {
        return res.status(404).json({ message: 'ID người dùng không hợp lệ' });
    }

    let existingUser;
    try {
        existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        await existingUser.deleteOne();
    } catch (error) {
        console.log(`Error in deleteUser controller: ${error.message}`);
        return res.status(500).json({
            message: 'Lỗi máy chủ. Hãy thử lại sau.'
        });
    }

    return res.status(200).json({
        message: 'Xóa người dùng thành công.'
    });
};

const logOut = async (req,res) => {
    try {
        res.cookie('jwt','',{
            maxAge: 0,
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
            secure: process.env.NODE_ENV === 'production' // only set secure cookies in production environment
        });
        
    } catch (error) {
        console.log(`Error in logOut controller: ${error.message}`);
        return res.status(500).json({
            message: 'Lỗi máy chủ. Hãy thử lại sau.'
        });
    }

    return res.status(200).json({
        message: 'Đăng xuất khỏi hệ thống thành công.'
    });
};

const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const {avatar, username, phoneNumber} = req.body.updateData;

    let existingUser;
    try {
        let updatedAvatar;
        // update avatar to cloudinary
        if (avatar){
            const uploadResult = await cloudinary.uploader.upload(avatar);
            updatedAvatar = uploadResult.secure_url;
        }

        existingUser = await User.findByIdAndUpdate(userId, {
            avatar: updatedAvatar,
            phoneNumber,
            username
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
    } catch (error) {
        console.log(`Error in updateProfile controller: ${error.message}`);
        return res.status(500).json({
            message: 'Lỗi máy chủ. Hãy thử lại sau.'
        });
    }

    return res.status(200).json({
        id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        avatar: existingUser.avatar,
        roles: existingUser.roles,
        phoneNumber: existingUser.phoneNumber,
        createdAt: existingUser.createdAt
    });
};

const checkAuth = (req,res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        return res.status(500).json({message: "Lỗi máy chủ. Hãy thử lại sau."});   

    }
};

export {logIn, getUsers, addUser, deleteUser, logOut, updateProfile, checkAuth};
