const core = require('@actions/core');
const github = require('@actions/github');

try {
  const result_in = core.getInput('compile_result');
  gitsha = github.context.sha;

  console.log(`GIT SHA = ${gitsha}`);

  const processed_out = process_compile_output(result_in);
  const comment_id = find_comment_id();
  if (comment_id != -1) {
    update_comment(comment_id, processed_out);
  } else {
    create_new_comment(processed_out);
  }
  core.setOutput("time", 0);
} catch (error) {
  core.setFailed(error.message);
}

function process_compile_output(compile_result) {
  const prefix = "/home/runner/work/DGame/DGame/";
  const str_begin_len = prefix.length;
  const splitLines = str => str.split(/\r?\n/);
  var matchingStrings = [];
  arrayOfLines = splitLines(compile_result);
  arrayOfLines.forEach(item => {
    var idx = item.indexOf(prefix);
    if (idx == 0) {

      // Retrive first occurence of ':'
      file_path_end_idx = item.indexOf(":");

      // Retrive file path (without github worker dir)
      file_path = item.substring(str_begin_len, file_path_end_idx);

      // Retrive line number of warning/error
      const file_name_offset = file_path_end_idx + 1;
      file_line_start = item.substring(file_name_offset, file_name_offset + item.substring(file_name_offset).indexOf(":"));
      file_line_end = (parseInt(file_line_start) + 3).toString();


      var new_line = `https://github.com/JacobDomagala/DGame/blob/${gitsha}/${file_path}#L${file_line_start}-${file_line_end}`;
      matchingStrings.push(new_line);
    }
  });

  matchingStrings.forEach(item => console.log(item));

  return matchingStrings;
}

function find_comment_id() {
  return -1;
}

function create_new_comment(comment_body) {

}

function update_comment(comment_id, comment_body) {

}