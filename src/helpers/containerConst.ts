
// 
export const INTERFACE_TYPE = {
    UserRepository: Symbol.for("UserRepository"),
    UserService: Symbol.for("UserService"),
    UserController: Symbol.for("UserController"),
    UserRoute: Symbol.for("UserRoute"),
    AuthMiddleware: Symbol.for("AuthMiddleware"),
    AuthRepository: Symbol.for("AuthRepository"),
    AuthService: Symbol.for("AuthService"),
    AuthController: Symbol.for("AuthController"),
    AuthRoute: Symbol.for("AuthRoute"),
    TaskerRepository: Symbol.for("TaskerRepository"),
    TaskerService: Symbol.for("TaskerService"),
    TaskerController: Symbol.for("TaskerController"),
    TaskerRoute: Symbol.for("TaskerRoute"),
    
    TaskRepository: Symbol.for("TaskRepository"),
    TaskService: Symbol.for("TaskService"),
    TaskController: Symbol.for("TaskController"),
    TaskRoute : Symbol.for("TaskRoute"),
   

    ProfileService: Symbol.for("ProfileService"),
    ProfileController: Symbol.for("ProfileController"),
    ProfileRoute: Symbol.for("ProfileRoute"),
    ProfileRepository: Symbol.for("ProfileRepository"),
    
    RoleService: Symbol.for("RoleService"),
    RoleController: Symbol.for("RoleController"),
    RoleRoute: Symbol.for("RoleRoute"),
    RoleRepository: Symbol.for("RoleRepository"),
    
    SearchRepository: Symbol.for("SearchRepository"),
    SearchService: Symbol.for("SearchService"),
    SearchController: Symbol.for("SearchController"),
    SearchRoute: Symbol.for("SearchRoute"),

    TaskAssignmentRepository: Symbol.for("TaskAssignmentRepository"),
    TaskAssignmentService: Symbol.for("TaskAssignmentService"),
    TaskAssignmentController: Symbol.for("TaskAssignmentController"),
    TaskAssignmentRoute: Symbol.for("TaskAssignmentRoute"),

    TaskApplicationRepository: Symbol.for("TaskApplicationRepository"),
    TaskApplicationService: Symbol.for("TaskApplicationService"),
    TaskApplicationController: Symbol.for("TaskApplicationController"),
    TaskApplicationRoute: Symbol.for("TaskApplicationRoute"),

    
    // skills symbol
    SkillsRepository: Symbol.for("SkillsRepository"),
    SkillsService: Symbol.for("SkillsService"),
    SkillsController: Symbol.for("SkillsController"),
    SkillsRoute: Symbol.for("SkillsRoute"),
    TaskerSkillsRepository: Symbol.for("TaskerSkillsRepository"),
    TaskerSkillsService: Symbol.for("TaskerSkillsService"),
    TaskerSkillsController: Symbol.for("TaskerSkillsController"),
    TaskerSkillsRoute: Symbol.for("TaskerSkillsRoute"),


    // category symbol
    CategoryRepository: Symbol.for("CategoryRepository"),
    CategoryService: Symbol.for("CategoryService"),
    CategoryController: Symbol.for("CategoryController"),
    CategoryRoute: Symbol.for("CategoryRoute"),

    // subcategory symbol
    SubCategoryRepository: Symbol.for("SubCategoryRepository"),
    SubCategoryService: Symbol.for("SubCategoryService"),
    SubCategoryController: Symbol.for("SubCategoryController"),
    SubCategoryRoute: Symbol.for("SubCategoryRoute"),

    // assign task symbol
    AssignTaskRepository: Symbol.for("AssignTaskRepository"),
    AssignTaskService: Symbol.for("AssignTaskService"),
    AssignTaskController: Symbol.for("AssignTaskController"),
    AssignTaskRoute: Symbol.for("AssignTaskRoute"),

    
    App: Symbol.for("App"),
    User: Symbol.for("User"),
  };