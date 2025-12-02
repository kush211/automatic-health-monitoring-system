{pkgs}: {
 
  channel = "stable-24.11"; 
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
  ];
  
  env = {};
  
  services.firebase.emulators = {
   
    detect = false;
    projectId = "demo-app";
    services = ["auth" "firestore"];
  };
  idx = {
   
    extensions = [
  
    ];
    workspace = {
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
    };
    
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
