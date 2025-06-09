(define (problem 69_0-goal)
  (:domain gripper-strips)
  (:objects
    office_06 - item
    tool_02 - item
    tool_04 - item
    tool_06 - item
    other_04 - item
    container_03 - container
    container_05 - container
  )
  (:init
    (in tool_02 container_05)
    (in tool_06 container_03)
    (in other_04 container_03)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
