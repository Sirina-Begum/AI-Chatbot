# Upload Excel File to Google Drive

## 🚨 **Issue**: "No Excel files found in Google Drive"

This error means your Google Drive API is working, but the Excel file isn't uploaded to Google Drive yet.

## ✅ **Solution**: Upload the Excel File

### **Step 1: Locate the Excel File**
The file `user_data.xlsx` is already created in your project folder:
- **Location**: `C:\Users\USER\OneDrive\Desktop\chatbot\user_data.xlsx`
- **Size**: ~20KB
- **Format**: Excel (.xlsx)

### **Step 2: Upload to Google Drive**

#### **Method A: Direct Upload**
1. **Open Google Drive**: https://drive.google.com/
2. **Click "New"** in the top left
3. **Select "File upload"**
4. **Navigate to**: `C:\Users\USER\OneDrive\Desktop\chatbot\`
5. **Select**: `user_data.xlsx`
6. **Click "Open"**

#### **Method B: Drag and Drop**
1. **Open Google Drive** in your browser
2. **Open File Explorer** to your project folder
3. **Drag** `user_data.xlsx` from File Explorer
4. **Drop** it into Google Drive window

#### **Method C: Copy and Paste**
1. **Open Google Drive**
2. **Right-click** in the main area
3. **Select "Upload files"**
4. **Choose** `user_data.xlsx`

### **Step 3: Verify Upload**
After uploading, you should see:
- ✅ `user_data.xlsx` in your Google Drive
- ✅ File is accessible and not in trash
- ✅ File has proper permissions

### **Step 4: Test the Application**
1. **Go to**: http://localhost:3000
2. **Enter User ID**: `U001`
3. **Click**: "Fetch Data"
4. **Expected**: Data loads from Google Drive (not test data)

## 🎯 **Expected Results**

### **Before Upload**
- Error: "No Excel files found in Google Drive"
- Source: "test-data" (fallback)

### **After Upload**
- Success: "Data fetched successfully from Google Drive"
- Source: "google-drive"

## 📊 **Test User IDs**

Once uploaded, test with these User IDs:
- **U001**: John Doe (Engineering)
- **U002**: Jane Smith (Marketing)
- **U003**: Bob Johnson (Sales)
- **U004**: Alice Brown (HR)
- **U005**: Charlie Wilson (Engineering)
- **U006**: Emma Davis (Marketing)
- **U007**: David Lee (Sales)
- **U008**: Sophia Garcia (Engineering)

## 🔍 **Troubleshooting**

### **"File not found"**
- Make sure you uploaded `user_data.xlsx` (not CSV)
- Check file is in the main Google Drive folder
- Verify file isn't in trash

### **"Still using test data"**
- Restart the server after upload
- Check console logs for Google Drive messages
- Verify credentials.json is in project folder

### **"Permission denied"**
- Make sure the file is accessible to your Google account
- Check if file is shared properly

## 🚀 **Quick Commands**

```bash
# Check if Excel file exists locally
Get-ChildItem user_data.xlsx

# Restart server after upload
npm run dev
```

---

**Upload the file and test again! 🚀** 