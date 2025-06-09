(define (problem 57_0-goal)
  (:domain gripper-strips)
  (:objects
    tool_04 - item
    tool_06 - item
    tool_07 - item
    tool_08 - item
    tool_09 - item
    container_04 - container
    container_05 - container
  )
  (:init
    (in tool_09 container_04)
    (in tool_08 container_04)
    (in tool_04 container_05)
    (in tool_07 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
